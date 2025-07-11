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

      // === CHANNEL ===
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
          { name: 'List Channels', value: 'listChannels' },
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

      // === CONTACT ===
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
          { name: 'List Contacts', value: 'listContacts' },
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

      // === MESSAGE ===
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
          { name: 'Send Message by Phone Number', value: 'sendMessage' },
          { name: 'Send Message by Contact ID', value: 'sendMessageByContactId' },
          { name: 'Send Template by Contact ID', value: 'sendTemplateByContactId' },
        ],
        default: 'sendMessage',
      },

      // -- sendMessage (via phone number)
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
        description: 'Número no formato internacional. Ex: +5511999999999',
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

      // -- sendMessageByContactId
      {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendMessageByContactId'],
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
            operation: ['sendMessageByContactId'],
          },
        },
      },
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: 'Teste de mensagem a partir da OmniAPI v3',
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendMessageByContactId'],
          },
        },
      },

      // -- sendTemplateByContactId
      {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendTemplateByContactId'],
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
            operation: ['sendTemplateByContactId'],
          },
        },
      },
      {
        displayName: 'Template UUID',
        name: 'templateUuid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendTemplateByContactId'],
          },
        },
      },
      {
        displayName: 'Header Parameters',
        name: 'headerParams',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Header Parameter',
        default: [],
        options: [
          {
            name: 'parameter',
            displayName: 'Parameter',
            values: [
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                  { name: 'Text', value: 'text' },
                  { name: 'Date/Time', value: 'date_time' },
                ],
                default: 'text',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendTemplateByContactId'],
          },
        },
      },
      {
        displayName: 'Body Parameters',
        name: 'bodyParams',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Body Parameter',
        default: [],
        options: [
          {
            name: 'parameter',
            displayName: 'Parameter',
            values: [
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                  { name: 'Text', value: 'text' },
                  { name: 'Date/Time', value: 'date_time' },
                ],
                default: 'text',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
        displayOptions: {
          show: {
            resource: ['message'],
            operation: ['sendTemplateByContactId'],
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

        // === CHANNELS ===
        if (resource === 'channel' && operation === 'listChannels') {
          const customerId = this.getNodeParameter('customerId', i);
          responseData = await apiRequest.call(
            this,
            'GET',
            `/accounts/${customerId}/account-channels/?include=*`
          );
        }

        // === CONTACTS ===
        else if (resource === 'contact' && operation === 'listContacts') {
          const accountId = this.getNodeParameter('accountId', i);
          const includeFields = this.getNodeParameter('contactInclude', i) as string[];
          const includeParam = includeFields.length > 0 ? includeFields.join(',') : 'attributes';
          responseData = await apiRequest.call(
            this,
            'GET',
            `/accounts/${accountId}/contacts?include=${includeParam}`
          );
        }

        // === MESSAGE by PHONE ===
        else if (resource === 'message' && operation === 'sendMessage') {
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
              body: { text },
            },
          };

          const endpoint = `/accounts/${accountId}/contacts/${encodeURIComponent(phoneNumber)}/messages?include=contact`;
          responseData = await apiRequest.call(this, 'POST', endpoint, body);
        }

        // === MESSAGE by CONTACT UUID ===
        else if (resource === 'message' && operation === 'sendMessageByContactId') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const accountChannelUuid = this.getNodeParameter('accountChannelUuid', i) as string;
          const text = this.getNodeParameter('text', i) as string;

          const body = {
            provider: 'WHATSAPP',
            account_channel_uuid: accountChannelUuid,
            type: 'TEXT',
            version: 'v3',
            direction: 'OUT',
            components: {
              body: { text },
            },
          };

          const endpoint = `/contacts/${contactId}/messages`;
          responseData = await apiRequest.call(this, 'POST', endpoint, body);
        }

        // === TEMPLATE ===
        else if (resource === 'message' && operation === 'sendTemplateByContactId') {
          const contactId = this.getNodeParameter('contactId', i) as string;
          const accountChannelUuid = this.getNodeParameter('accountChannelUuid', i) as string;
          const templateUuid = this.getNodeParameter('templateUuid', i) as string;
          const headerParams = this.getNodeParameter('headerParams.parameter', i, []) as any[];
          const bodyParams = this.getNodeParameter('bodyParams.parameter', i, []) as any[];

          const components: any = {};

          if (headerParams.length > 0) {
            components.header = {
              parameters: headerParams.map((param) => ({
                type: param.type,
                [param.type === 'text' ? 'text' : 'date_time']: param.value,
              })),
            };
          }

          if (bodyParams.length > 0) {
            components.body = {
              parameters: bodyParams.map((param) => ({
                type: param.type,
                [param.type === 'text' ? 'text' : 'date_time']: param.value,
              })),
            };
          }

          const body = {
            provider: 'WHATSAPP',
            account_channel_uuid: accountChannelUuid,
            template_uuid: templateUuid,
            type: 'TEMPLATE',
            version: 'v3',
            components,
          };

          const endpoint = `/contacts/${contactId}/messages`;
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
