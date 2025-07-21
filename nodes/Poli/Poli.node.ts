import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  JsonObject,
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
    description: 'Nó para interagir com a API da Poli',
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
        options: [
          { name: 'Channel', value: 'channel' },
          { name: 'Contact', value: 'contact' },
          { name: 'Message', value: 'message' },
          { name: 'Template', value: 'template' },
          { name: 'App', value: 'app' },
          { name: 'Tag', value: 'tag' },
          { name: 'Webhook', value: 'webhook' },
        ],
        default: 'channel',
      },

      // CHANNEL
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['channel'] } },
        options: [{ name: 'List Channels', value: 'listChannels' }],
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

      // CONTACT
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['contact'] } },
        options: [
          { name: 'List Contacts', value: 'listContacts' },
          { name: 'Forward Contact', value: 'forwardContact' },
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
      {
        displayName: 'Contact UUID',
        name: 'contactUuid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['contact'],
            operation: ['forwardContact'],
          },
        },
      },
      {
        displayName: 'User UUID',
        name: 'userUuid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['contact'],
            operation: ['forwardContact'],
          },
        },
      },
      {
        displayName: 'Team UUID',
        name: 'teamUuid',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            resource: ['contact'],
            operation: ['forwardContact'],
          },
        },
      },

      // MESSAGE
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['message'] } },
        options: [
          { name: 'Send Message By Phone Number', value: 'sendMessage' },
          { name: 'Send Message By Contact ID', value: 'sendMessageByContactId' },
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
          show: { resource: ['message'], operation: ['sendMessage'] },
        },
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['message'], operation: ['sendMessage'] },
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
            operation: ['sendMessage', 'sendMessageByContactId'],
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
            operation: ['sendMessage', 'sendMessageByContactId'],
          },
        },
      },
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

      // TEMPLATE
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['template'] } },
        options: [
          { name: 'List Templates', value: 'listTemplates' },
          { name: 'Send Template By Contact ID', value: 'sendTemplateByContactId' },
        ],
        default: 'listTemplates',
      },
      {
        displayName: 'Account ID',
        name: 'accountIdTemplate',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['template'], operation: ['listTemplates'] },
        },
      },
      {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
        },
      },
      {
        displayName: 'Account Channel UUID',
        name: 'accountChannelUuid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
        },
      },
      {
        displayName: 'Template UUID',
        name: 'templateUuid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
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
          show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
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
          show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
        },
      },

      // APP
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['app'] } },
        options: [
          { name: 'Create App', value: 'createApp' },
          { name: 'List Apps', value: 'listApps' }
        ],
        default: 'createApp',
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { 
            resource: ['app'], 
            operation: ['createApp', 'listApps'] 
          },
        },
      },
      {
        displayName: 'Visibility',
        name: 'visibility',
        type: 'options',
        options: [
          { name: 'Public', value: 'public' },
          { name: 'Private', value: 'private' },
        ],
        default: 'public',
        required: true,
        displayOptions: {
          show: { resource: ['app'], operation: ['createApp'] },
        },
      },
      {
        displayName: 'App Name',
        name: 'appName',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['app'], operation: ['createApp'] },
        },
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['app'], operation: ['createApp'] },
        },
      },
      {
        displayName: 'Responsible',
        name: 'responsible',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['app'], operation: ['createApp'] },
        },
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['app'], operation: ['createApp'] },
        },
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['app'], operation: ['createApp'] },
        },
      },
      {
        displayName: 'Picture File ID',
        name: 'pictureFileId',
        type: 'string',
        default: '',
        required: false,
        displayOptions: {
          show: { resource: ['app'], operation: ['createApp'] },
        },
      },
      {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        required: false,
        description: 'Número da página para listar os aplicativos',
        displayOptions: {
          show: {
            resource: ['app'],
            operation: ['listApps'],
          },
        },
      },

      // TAG
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['tag'] } },
        options: [
          { name: 'List Tags', value: 'listTags' },
          { name: 'Add Tag to Contact', value: 'addTagToContact' },
        ],
        default: 'listTags',
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['listTags'],
          },
        },
        description: 'ID da conta para listar as tags',
      },
      {
        displayName: 'Contact UUID',
        name: 'contactUuid',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['addTagToContact'],
          },
        },
        description: 'UUID do contato ao qual a tag será adicionada',
      },
      {
        displayName: 'Tag UUID',
        name: 'tagUuid',
        type: 'string',
        required: true,
        default: '',
        displayOptions: {
          show: {
            resource: ['tag'],
            operation: ['addTagToContact'],
          },
        },
        description: 'UUID da tag que será adicionada ao contato',
      },

      // WEBHOOK
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['webhook'] } },
        options: [
          { name: 'Create Webhook', value: 'createWebhook' },
          { name: 'List Webhooks', value: 'listWebhooks' }
        ],
        default: 'createWebhook',
      },
      {
        displayName: 'Application ID',
        name: 'applicationId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { 
            resource: ['webhook'],
            operation: ['createWebhook', 'listWebhooks']
          },
        },
      },
      {
        displayName: 'Webhook URL',
        name: 'url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { resource: ['webhook'], operation: ['createWebhook'] },
        },
      },
      {
        displayName: 'Subscriptions',
        name: 'subscriptions',
        type: 'multiOptions',
        options: [
          { name: 'Organizations', value: 'organizations' },
          { name: 'Chats', value: 'chats' },
          { name: 'Contacts', value: 'contacts' },
          { name: 'Users', value: 'users' },
          { name: 'Applications', value: 'applications' },
        ],
        default: [],
        required: true,
        displayOptions: {
          show: { resource: ['webhook'], operation: ['createWebhook'] },
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
          responseData = await apiRequest.call(this, 'GET', `/accounts/${customerId}/account-channels/?include=*`);
        } else if (resource === 'contact' && operation === 'listContacts') {
          const accountId = this.getNodeParameter('accountId', i);
          const includeFields = this.getNodeParameter('contactInclude', i) as string[];
          const includeParam = includeFields.join(',');
          responseData = await apiRequest.call(this, 'GET', `/accounts/${accountId}/contacts?include=${includeParam}`);
        } else if (resource === 'message' && operation === 'sendMessage') {
          const accountId = this.getNodeParameter('accountIdMessage', i);
          const phoneNumber = this.getNodeParameter('phoneNumber', i);
          const accountChannelUuid = this.getNodeParameter('accountChannelUuid', i);
          const text = this.getNodeParameter('text', i);

          const body = {
            provider: 'WHATSAPP',
            account_channel_uuid: accountChannelUuid,
            type: 'TEXT',
            version: 'v3',
            components: { body: { text } },
          };

          const endpoint = `/accounts/${accountId}/contacts/${encodeURIComponent(phoneNumber?.toString() || '')}/messages?include=contact`;
          responseData = await apiRequest.call(this, 'POST', endpoint, body);
        } else if (resource === 'message' && operation === 'sendMessageByContactId') {
          const contactId = this.getNodeParameter('contactId', i);
          const accountChannelUuid = this.getNodeParameter('accountChannelUuid', i);
          const text = this.getNodeParameter('text', i);

          const body = {
            provider: 'WHATSAPP',
            account_channel_uuid: accountChannelUuid,
            type: 'TEXT',
            version: 'v3',
            direction: 'OUT',
            components: { body: { text } },
          };

          const endpoint = `/contacts/${contactId}/messages`;
          responseData = await apiRequest.call(this, 'POST', endpoint, body);
        } else if (resource === 'template' && operation === 'sendTemplateByContactId') {
          const contactId = this.getNodeParameter('contactId', i);
          const accountChannelUuid = this.getNodeParameter('accountChannelUuid', i);
          const templateUuid = this.getNodeParameter('templateUuid', i);
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

          responseData = await apiRequest.call(this, 'POST', `/contacts/${contactId}/messages`, body);
        } else if (resource === 'template' && operation === 'listTemplates') {
          const accountId = this.getNodeParameter('accountIdTemplate', i);
          const endpoint = `/accounts/${accountId}/templates?include=key,version,status,message,team,metadata`;
          responseData = await apiRequest.call(this, 'GET', endpoint);
        } else if (resource === 'tag' && operation === 'listTags') {
          const accountId = this.getNodeParameter('accountId', i);
          const endpoint = `/accounts/${accountId}/tags?include=attributes`;
          responseData = await apiRequest.call(this, 'GET', endpoint);
        } else if (resource === 'app' && operation === 'createApp') {
          const accountId = this.getNodeParameter('accountId', i);
          const visibility = this.getNodeParameter('visibility', i) as string;
          const appName = this.getNodeParameter('appName', i) as string;
          const description = this.getNodeParameter('description', i) as string;
          const responsible = this.getNodeParameter('responsible', i) as string;
          const phone = this.getNodeParameter('phone', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const pictureFileId = this.getNodeParameter('pictureFileId', i, '') as string;

          const body = {
            visibility: visibility.toUpperCase(),
            attributes: {
              name: appName,
              description,
              responsible,
              phone,
              email,
              picture: pictureFileId ? { file_id: pictureFileId } : undefined,
            },
            attachments: [],
            settings: [
              {
                type: 'link',
                name: 'webhook',
                placeholder: 'https://example.com/webhook'
              }
            ],
            resources: []
          };

          const endpoint = `/accounts/${accountId}/applications?include=attributes`;
          responseData = await apiRequest.call(this, 'POST', endpoint, body);
        } else if (resource === 'app' && operation === 'listApps') {
          const accountId = this.getNodeParameter('accountId', i);
          const page = this.getNodeParameter('page', i) as number;

          const endpoint = `/accounts/${accountId}/applications?include=attributes&page=${page}`;
          responseData = await apiRequest.call(this, 'GET', endpoint);
        } else if (resource === 'tag' && operation === 'listTags') {
          const accountId = this.getNodeParameter('accountId', i);
          responseData = await apiRequest.call(this, 'GET', `/accounts/${accountId}/tags`);
        } else if (resource === 'tag' && operation === 'createTag') {
          const accountId = this.getNodeParameter('accountId', i);
          const tagName = this.getNodeParameter('tagName', i);

          const body = {
            name: tagName,
          };

          responseData = await apiRequest.call(this, 'POST', `/accounts/${accountId}/tags`, body);
        } else if (resource === 'tag' && operation === 'deleteTag') {
          const accountId = this.getNodeParameter('accountId', i);
          const tagId = this.getNodeParameter('tagId', i);

          responseData = await apiRequest.call(this, 'DELETE', `/accounts/${accountId}/tags/${tagId}`);
        } else if (resource === 'webhook' && operation === 'listWebhooks') {
          const applicationId = this.getNodeParameter('applicationId', i);
          const endpoint = `/applications/${applicationId}/webhooks?include=url,subscriptions,application`;
          responseData = await apiRequest.call(this, 'GET', endpoint);
        } else if (resource === 'webhook' && operation === 'createWebhook') {
          const applicationId = this.getNodeParameter('applicationId', i);
          const url = this.getNodeParameter('url', i) as string;
          const subscriptions = this.getNodeParameter('subscriptions', i) as string[];

          // Validar URL
          try {
            new URL(url);
          } catch (error) {
            throw new Error('URL do webhook inválida. Por favor, forneça uma URL válida.');
          }

          // Validar subscriptions
          if (!subscriptions || subscriptions.length === 0) {
            throw new Error('É necessário selecionar pelo menos uma subscription.');
          }

          const validSubscriptions = ['organizations', 'chats', 'contacts', 'users', 'applications'];
          const invalidSubscriptions = subscriptions.filter(s => !validSubscriptions.includes(s));
          if (invalidSubscriptions.length > 0) {
            throw new Error(`Subscriptions inválidas: ${invalidSubscriptions.join(', ')}`);
          }

          const body = { url, subscriptions };
          const endpoint = `/applications/${applicationId}/webhooks?include=url,subscriptions`;
          
          try {
            responseData = await apiRequest.call(this, 'POST', endpoint, body);
          } catch (error: any) {
            if (error.message?.includes('already exists')) {
              throw new Error('Já existe um webhook configurado com esta URL para esta aplicação.');
            }
            throw error;
          }
        } else if (resource === 'webhook' && operation === 'listWebhooks') {
          const applicationId = this.getNodeParameter('applicationId', i);
          responseData = await apiRequest.call(this, 'GET', `/applications/${applicationId}/webhooks?include=url,subscriptions`);
        } else if (resource === 'contact' && operation === 'forwardContact') {
          const contactUuid = this.getNodeParameter('contactUuid', i);
          const userUuid = this.getNodeParameter('userUuid', i) as string;
          const teamUuid = this.getNodeParameter('teamUuid', i, null) as string | null;

          const body: { user_uuid: string; team_uuid?: string | null } = {
            user_uuid: userUuid,
          };

          if (teamUuid) {
            body.team_uuid = teamUuid;
          }

          const endpoint = `/contacts/${contactUuid}/forward`;
          try {
            responseData = await apiRequest.call(this, 'POST', endpoint, body);
          } catch (error) {
            console.error('Erro ao redirecionar contato:', error);
            throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
          }
        }

        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
      }
    }

    return [returnData];
  }
}