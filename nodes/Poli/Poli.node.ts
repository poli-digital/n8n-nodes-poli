import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  JsonObject,
  NodeConnectionType,
} from 'n8n-workflow';

import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class Poli implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Poli',
    name: 'poli',
    icon: 'file:poli.svg',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Nó para interagir com a API da Poli',
    defaults: {
      name: 'Poli',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'poliApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Channel', value: 'channel' },
          { name: 'Contact', value: 'contact' },
          { name: 'Message', value: 'message' },
        ],
        default: 'channel',
      },
      // Operações para Channel
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['channel'],
          },
        },
        options: [
          {
            name: 'List Channels',
            value: 'listChannels',
          },
        ],
        default: 'listChannels',
      },
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['channel'],
            operation: ['listChannels'],
          },
        },
      },

      // Operações para Contact
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['contact'],
          },
        },
        options: [
          {
            name: 'List Contacts',
            value: 'listContacts',
          },
        ],
        default: 'listContacts',
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['contact'],
            operation: ['listContacts'],
          },
        },
      },
      {
        displayName: 'Include',
        name: 'contactInclude',
        type: 'multiOptions',
        options: [
          { name: 'Attributes', value: 'attributes' },
          { name: 'Metadata', value: 'metadata' },
          { name: 'Organization', value: 'organization' },
          { name: 'Addresses', value: 'addresses' },
        ],
        default: ['attributes'],
        displayOptions: {
          show: {
            resource: ['contact'],
            operation: ['listContacts'],
          },
        },
      },

      // Operações para Message
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: ['message'],
          },
        },
        options: [
          {
            name: 'Send Message',
            value: 'sendMessage',
          },
        ],
        default: 'sendMessage',
      },
      {
        displayName: 'Account ID',
        name: 'accountIdMessage',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendMessage'],
          },
        },
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        required: true,
        description: 'Número de telefone do contato no formato internacional, ex: +5511999999999',
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendMessage'],
          },
        },
      },
      {
        displayName: 'Account Channel UUID',
        name: 'accountChannelUuid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendMessage'],
          },
        },
      },
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: 'Teste de mensagem',
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendMessage'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        let responseData;

        if (resource === 'channel' && operation === 'listChannels') {
          const customerId = this.getNodeParameter('customerId', i);
          responseData = await apiRequest.call(
            this,
            'GET',
            `/accounts/${customerId}/account-channels/?include=*`
          );
        } else if (resource === 'contact' && operation === 'listContacts') {
          const accountId = this.getNodeParameter('accountId', i);
          const includeFields = this.getNodeParameter('contactInclude', i) as string[];
          const includeParam = includeFields.length > 0 ? includeFields.join(',') : 'attributes';
          responseData = await apiRequest.call(
            this,
            'GET',
            `/accounts/${accountId}/contacts?include=${includeParam}`
          );
        } else if (resource === 'message' && operation === 'sendMessage') {
          const accountId = this.getNodeParameter('accountIdMessage', i) as string;
          const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
          const accountChannelUuid = this.getNodeParameter('accountChannelUuid', i) as string;
          const text = this.getNodeParameter('text', i) as string;

          const body = {
            provider: 'WHATSAPP',
            account_channel_uuid: accountChannelUuid,
            type: 'TEXT',
            version: 'v3',
            components: {
              body: {
                text,
              },
            },
          };

          const endpoint = `/accounts/${accountId}/contacts/${encodeURIComponent(phoneNumber)}/messages?include=contact`;

          responseData = await apiRequest.call(this, 'POST', endpoint, body);
        }

        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
