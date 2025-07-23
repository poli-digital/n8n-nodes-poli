import { IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class ListContacts {
  description = {
    displayName: 'List Contacts',
    name: 'listContacts',
    group: ['output'],
    version: 1,
    description: 'List all contacts',
    defaults: {
      name: 'List Contacts',
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
        displayName: 'Include',
        name: 'contactInclude',
        type: 'multiOptions',
        options: [
          { name: 'Attributes', value: 'attributes' },
          { name: 'Metadata', value: 'metadata' },
          { name: 'Organization', value: 'organization' },
          { name: 'Addresses', value: 'addresses' },
        ],
        default: ['attributes'],
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const accountId = this.getNodeParameter('accountId', i);
        const includeFields = this.getNodeParameter('contactInclude', i) as string[];
        const includeParam = includeFields.join(',');

        const endpoint = `/accounts/${accountId}/contacts?include=${includeParam}`;
        const responseData = await apiRequest.call(this, 'GET', endpoint);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}