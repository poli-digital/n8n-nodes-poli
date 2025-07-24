import { IExecuteFunctions, INodeType, INodeTypeDescription, JsonObject, NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class Poli implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Poli',
    name: 'poli',
    icon: 'file:poli.svg',
    group: ['output'],
    version: 1,
    description: 'Interact with Poli API',
    defaults: {
      name: 'Poli',
    },
    inputs: ['main'],
    outputs: ['main'],
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
        noDataExpression: true,
        options: [
          {
            name: 'Contact',
            value: 'contact',
          },
          {
            name: 'App',
            value: 'app',
          },
          {
            name: 'Tag',
            value: 'tag',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          },
          {
            name: 'Channel',
            value: 'channel',
          },
          {
            name: 'Template',
            value: 'template',
          },
          {
            name: 'Message',
            value: 'message',
          },
        ],
        default: 'contact',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['contact'],
          },
        },
        options: [
          {
            name: 'Add Tag',
            value: 'addTag',
            action: 'Add Tag To Contact',
          },
          {
            name: 'Forward',
            value: 'forward',
            action: 'Forward Contact',
          },
          {
            name: 'List',
            value: 'list',
            action: 'List Contacts',
          },
          {
            name: 'Send Message By ID',
            value: 'sendMessage',
            action: 'Send Message By Contact ID',
          },
          {
            name: 'Send Template By ID',
            value: 'sendTemplate',
            action: 'Send Template By Contact ID',
          },
        ],
        default: 'list',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['app'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create App',
          },
          {
            name: 'List',
            value: 'list',
            action: 'List Apps',
          },
        ],
        default: 'list',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['tag'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create Tag',
          },
          {
            name: 'List',
            value: 'list',
            action: 'List Tags',
          },
        ],
        default: 'list',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['webhook'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            action: 'Create Webhook',
          },
          {
            name: 'List',
            value: 'list',
            action: 'List Webhooks',
          },
        ],
        default: 'list',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['channel'],
          },
        },
        options: [
          {
            name: 'List',
            value: 'list',
            action: 'List Channels',
          },
        ],
        default: 'list',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['template'],
          },
        },
        options: [
          {
            name: 'List',
            value: 'list',
            action: 'List Templates',
          },
        ],
        default: 'list',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['message'],
          },
        },
        options: [
          {
            name: 'Send By Phone Number',
            value: 'sendByPhone',
            action: 'Send Message By Phone Number',
          },
        ],
        default: 'sendByPhone',
      },
      // Contact fields
      {
        displayName: 'Contact UUID',
        name: 'contactUuid',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['contact'],
            operation: ['addTag', 'forward', 'sendMessage', 'sendTemplate'],
          },
        },
        default: '',
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['contact', 'app', 'tag', 'channel', 'template', 'message'],
          },
        },
        default: '',
      },
      // Additional fields would go here...
      // This is a simplified version for demonstration
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;

        if (resource === 'contact' && operation === 'list') {
          const accountId = this.getNodeParameter('accountId', i);
          const endpoint = `/accounts/${accountId}/contacts`;
          responseData = await apiRequest.call(this, 'GET', endpoint);
        }
        // Add more operations here following the same pattern...
        else {
          throw new Error(`Operation '${operation}' for resource '${resource}' not implemented yet`);
        }

        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}
