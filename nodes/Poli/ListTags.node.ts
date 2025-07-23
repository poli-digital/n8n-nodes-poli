import { IExecuteFunctions, INodeType, INodeTypeDescription, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class ListTags implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'List Tags',
    name: 'listTags',
    icon: 'file:poli.svg',
    group: ['output'],
    version: 1,
    description: 'List all tags',
    defaults: {
      name: 'List Tags',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'poliApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        required: true,
        description: 'ID da conta para listar as tags',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const accountId = this.getNodeParameter('accountId', i);

        const endpoint = `/accounts/${accountId}/tags?include=attributes`;
        const responseData = await apiRequest.call(this, 'GET', endpoint);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}