import { IResourceDescription } from '../interfaces/common';

export const channelDescription: IResourceDescription = {
  displayName: 'Channel',
  name: 'channel',
  value: 'channel',
  operations: [
    {
      displayName: 'List Channels',
      name: 'operation',
      value: 'listChannels',
      properties: [],
    },
  ],
  properties: [
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
  ],
};
