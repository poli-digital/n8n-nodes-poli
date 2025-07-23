import { IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class ListWebhooks {
  description = {
    displayName: 'List Webhooks',
    name: 'listWebhooks',
    group: ['output'],
    version: 1,
    description: 'List all webhooks',
    defaults: {
      name: 'List Webhooks',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Application ID',
        name: 'applicationId',
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
        const applicationId = this.getNodeParameter('applicationId', i);

        const endpoint = `/applications/${applicationId}/webhooks?include=url,subscriptions,application`;
        const responseData = await apiRequest.call(this, 'GET', endpoint);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}