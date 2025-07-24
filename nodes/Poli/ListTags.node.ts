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
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Search',
            name: 'search',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Order',
            name: 'order',
            type: 'string',
            default: '',
          },
          {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            default: 1,
          },
          {
            displayName: 'Per Page',
            name: 'perPage',
            type: 'number',
            default: 100,
          },
          {
            displayName: 'Query (JSON)',
            name: 'query',
            type: 'string',
            default: '',
            description: 'Ex: {"status": "ACTIVE"}',
          },
          {
            displayName: 'Include',
            name: 'include',
            type: 'multiOptions',
            options: [
              { name: 'Status', value: 'status' },
              { name: 'Category', value: 'category' },
              { name: 'Attributes', value: 'attributes' },
              { name: 'Contacts', value: 'contacts' },
              { name: 'Metadata', value: 'metadata' },
            ],
            default: ['attributes'],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const accountId = this.getNodeParameter('accountId', i);
        const options = this.getNodeParameter('options', i, {}) as {
          search?: string;
          order?: string;
          page?: number;
          perPage?: number;
          query?: string;
          include?: string[];
        };

        const queryParams: string[] = [];

        if (options.search) {
          queryParams.push(`search=${encodeURIComponent(options.search)}`);
        }

        if (options.order) {
          queryParams.push(`order=${encodeURIComponent(options.order)}`);
        }

        if (options.page) {
          queryParams.push(`page=${options.page}`);
        }

        if (options.perPage) {
          queryParams.push(`perPage=${options.perPage}`);
        }

        if (options.include?.length) {
          queryParams.push(`include=${options.include.join(',')}`);
        }

        if (options.query) {
          try {
            const parsedQuery = JSON.parse(options.query);
            for (const [key, value] of Object.entries(parsedQuery)) {
              queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
            }
          } catch (e) {
            throw new Error('Invalid JSON in Query field');
          }
        }

        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const endpoint = `/accounts/${accountId}/tags${queryString}`;

        const responseData = await apiRequest.call(this, 'GET', endpoint);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}
