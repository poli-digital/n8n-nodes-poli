import { INodeTypeDescription, NodePropertyTypes } from 'n8n-workflow';

export const nodeDescription: INodeTypeDescription = {
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
  requestDefaults: {
    baseURL: 'https://api.poli.digital/v1',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
  properties: [
    {
      displayName: 'Resource',
      name: 'resource',
      type: 'options' as NodePropertyTypes,
      noDataExpression: true,
      options: [
        {
          name: 'App',
          value: 'app',
        },
        {
          name: 'Channel',
          value: 'channel',
        },
        {
          name: 'Contact',
          value: 'contact',
        },
        {
          name: 'Message',
          value: 'message',
        },
        {
          name: 'Template',
          value: 'template',
        },
        {
          name: 'Webhook',
          value: 'webhook',
        },
      ],
      default: 'app',
    },
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options' as NodePropertyTypes,
      displayOptions: {
        show: {
          resource: ['app', 'channel', 'contact', 'message', 'template', 'webhook'],
        },
      },
      default: '',
      noDataExpression: true,
    },
  ],
};
