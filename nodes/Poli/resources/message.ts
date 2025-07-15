import { IResourceDescription } from '../interfaces/common';

export const messageDescription: IResourceDescription = {
  displayName: 'Message',
  name: 'message',
  value: 'message',
  operations: [
    {
      displayName: 'Send Message By Phone Number',
      name: 'operation',
      value: 'sendMessage',
      properties: [],
    },
    {
      displayName: 'Send Message By Contact ID',
      name: 'operation',
      value: 'sendMessageByContactId',
      properties: [],
    },
  ],
  properties: [
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
  ],
};
