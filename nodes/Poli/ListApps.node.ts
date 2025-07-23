import { IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class ListApps {
  description = {
    displayName: 'List Apps',
    name: 'listApps',
    group: ['output'],
    version: 1,
    description: 'List all applications',
    defaults: {
      name: 'List Apps',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Page',
        name: 'page',
        type: 'number',
        default: 1,
        required: false,
        description: 'Número da página para listar os aplicativos',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const accountId = this.getNodeParameter('accountId', i);
        const page = this.getNodeParameter('page', i) as number;

        const endpoint = `/accounts/${accountId}/applications?include=attributes&page=${page}`;
        const responseData = await apiRequest.call(this, 'GET', endpoint);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}