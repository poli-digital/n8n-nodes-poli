import { IExecuteFunctions, INodeType, INodeTypeDescription, JsonObject, NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class CreateTag implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Create Tag',
    name: 'createTag',
    icon: 'file:poli.svg',
    group: ['output'],
    version: 1,
    description: 'Create a new tag',
    defaults: {
      name: 'Create Tag',
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
      },
      {
        displayName: 'Tag Name',
        name: 'tagName',
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
        const accountId = this.getNodeParameter('accountId', i);
        const tagName = this.getNodeParameter('tagName', i);

        const body = {
          name: tagName,
        };

        const endpoint = `/accounts/${accountId}/tags`;
        const responseData = await apiRequest.call(this, 'POST', endpoint, body);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}