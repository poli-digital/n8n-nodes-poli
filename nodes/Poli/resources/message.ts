import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject } from 'n8n-workflow';
import { BaseResource } from './base';

export const messageDescription = {
  displayName: 'Message',
  name: 'message',
  value: 'message',
  operations: [
    {
      displayName: 'Send',
      name: 'operation',
      value: 'sendMessage',
      description: 'Send a message',
      action: 'Send a message',
    },
    {
      displayName: 'Get History',
      name: 'operation',
      value: 'getMessageHistory',
      description: 'Get message history',
      action: 'Get message history',
    },
  ],
  properties: [
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      displayOptions: { show: { resource: ['message'] } },
      options: [
        {
          name: 'Send',
          value: 'sendMessage',
        },
        {
          name: 'Get History',
          value: 'getMessageHistory',
        },
      ],
      default: 'sendMessage',
    },
  ],
};

export class MessageResource extends BaseResource {
  static async send(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject> {
    const body = {
      channelId: executeFunctions.getNodeParameter('channelId', index) as string,
      recipientId: executeFunctions.getNodeParameter('recipientId', index) as string,
      content: executeFunctions.getNodeParameter('content', index) as string,
      type: executeFunctions.getNodeParameter('messageType', index) as string,
    };

    return await this.makeRequest(executeFunctions, 'POST', '/messages', body, index);
  }

  static async getHistory(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject[]> {
    const channelId = executeFunctions.getNodeParameter('channelId', index) as string;
    const contactId = executeFunctions.getNodeParameter('contactId', index) as string;

    const response = await this.makeRequest(
      executeFunctions,
      'GET',
      `/channels/${channelId}/contacts/${contactId}/messages`,
      {},
      index,
    );

    return response.messages as IDataObject[] || [];
  }
}
