import { IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class SendMessageByPhoneNumber {
  description = {
    displayName: 'Send Message By Phone Number',
    name: 'sendMessage',
    group: ['output'],
    version: 1,
    description: 'Send a message to a phone number',
    defaults: {
      name: 'Send Message By Phone Number',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Account ID',
        name: 'accountIdMessage',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Account Channel UUID',
        name: 'accountChannelUuid',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: 'Teste de mensagem',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
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
        const responseData = await apiRequest.call(this, 'POST', endpoint, body);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}