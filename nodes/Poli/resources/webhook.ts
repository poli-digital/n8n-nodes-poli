import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { IResourceDescription } from '../interfaces/common';
import { BaseResource } from './base';

export const webhookDescription: IResourceDescription = {
  displayName: 'Webhook',
  name: 'webhook',
  value: 'webhook',
  operations: [
    {
      displayName: 'Create',
      name: 'operation',
      value: 'createWebhook',
      description: 'Create a new webhook',
      action: 'Create a webhook',
    },
    {
      displayName: 'List',
      name: 'operation',
      value: 'listWebhooks',
      description: 'Get list of webhooks',
      action: 'Get list of webhooks',
    },
  ],
  properties: [
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      displayOptions: { show: { resource: ['webhook'] } },
      options: [
        {
          name: 'Create',
          value: 'createWebhook',
        },
        {
          name: 'List',
          value: 'listWebhooks',
        },
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
        show: { resource: ['webhook'], operation: ['createWebhook', 'listWebhooks'] },
      },
    },
    {
      displayName: 'Application ID',
      name: 'applicationId',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: { resource: ['webhook'], operation: ['createWebhook'] },
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

export class WebhookResource extends BaseResource {
  static async create(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject> {
    const applicationId = executeFunctions.getNodeParameter('applicationId', index);
    const url = executeFunctions.getNodeParameter('url', index) as string;
    const subscriptions = executeFunctions.getNodeParameter('subscriptions', index) as string[];

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
      return await this.makeRequest(executeFunctions, 'POST', endpoint, body, index);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        throw new Error('Já existe um webhook configurado com esta URL para esta aplicação.');
      }
      throw error;
    }
  }

  static async list(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject[]> {
    const applicationId = executeFunctions.getNodeParameter('applicationId', index) as string;

    const response = await this.makeRequest(
      executeFunctions,
      'GET',
      `/applications/${applicationId}/webhooks`,
      {},
      index,
    );

    return response.webhooks as IDataObject[] || [];
  }
}
