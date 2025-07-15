import { IResourceDescription } from '../interfaces/common';

export const webhookDescription: IResourceDescription = {
  displayName: 'Webhook',
  name: 'webhook',
  value: 'webhook',
  operations: [
    {
      displayName: 'Create Webhook',
      name: 'operation',
      value: 'createWebhook',
      properties: [],
    },
  ],
  properties: [
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      displayOptions: { show: { resource: ['webhook'] } },
      options: [{ name: 'Create Webhook', value: 'createWebhook' }],
      default: 'createWebhook',
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
