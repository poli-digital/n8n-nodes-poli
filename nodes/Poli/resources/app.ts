import { IResourceDescription } from '../interfaces/common';

export const appDescription: IResourceDescription = {
  displayName: 'App',
  name: 'app',
  value: 'app',
  operations: [
    {
      displayName: 'Create App',
      name: 'operation',
      value: 'createApp',
      properties: [],
    },
  ],
  properties: [
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      displayOptions: { show: { resource: ['app'] } },
      options: [{ name: 'Create App', value: 'createApp' }],
      default: 'createApp',
    },
    {
      displayName: 'Account ID',
      name: 'accountId',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: { resource: ['app'], operation: ['createApp'] },
      },
    },
    {
      displayName: 'Visibility',
      name: 'visibility',
      type: 'options',
      options: [
        { name: 'Public', value: 'PUBLIC' },
        { name: 'Private', value: 'PRIVATE' },
      ],
      default: 'PUBLIC',
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
      displayName: 'Responsible Name',
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
      displayOptions: {
        show: { resource: ['app'], operation: ['createApp'] },
      },
    },
  ],
};
