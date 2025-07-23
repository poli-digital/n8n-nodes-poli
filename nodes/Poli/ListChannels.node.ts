import { IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class ListChannels {
  description = {
    displayName: 'List Channels',
    name: 'listChannels',
    group: ['output'],
    version: 1,
    description: 'List all channels',
    defaults: {
      name: 'List Channels',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        default: '',
        required: true,
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const customerId = this.getNodeParameter('customerId', i);

        const endpoint = `/accounts/${customerId}/account-channels/?include=*`;
        const responseData = await apiRequest.call(this, 'GET', endpoint);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}