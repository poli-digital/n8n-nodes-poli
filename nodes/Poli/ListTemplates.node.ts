import { IExecuteFunctions, INodeType, INodeTypeDescription, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class ListTemplates implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'List Templates',
    name: 'listTemplates',
    icon: 'file:poli.svg',
    group: ['output'],
    version: 1,
    description: 'List all templates',
    defaults: {
      name: 'List Templates',
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
        name: 'accountIdTemplate',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        default: {},
        placeholder: 'Add Option',
        options: [
          {
            displayName: 'Search',
            name: 'search',
            type: 'string',
            default: '',
            description: 'Search text',
          },
          {
            displayName: 'Order',
            name: 'order',
            type: 'string',
            default: '',
            description: 'Sort order (e.g., created_at:desc)',
          },
          {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            default: 1,
            description: 'Page number for pagination',
          },
          {
            displayName: 'Per Page',
            name: 'perPage',
            type: 'number',
            default: 50,
            description: 'Number of items per page',
          },
          {
            displayName: 'Include',
            name: 'include',
            type: 'multiOptions',
            options: [
              { name: 'Key', value: 'key' },
              { name: 'Version', value: 'version' },
              { name: 'Status', value: 'status' },
              { name: 'Message', value: 'message' },
              { name: 'Team', value: 'team' },
              { name: 'Metadata', value: 'metadata' },
            ],
            default: [],
            description: 'Additional resources to include',
          },
          {
            displayName: 'Query',
            name: 'query',
            type: 'string',
            default: '',
            description: 'Advanced filtering (e.g., id=18 or name=gabriel)',
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
        const accountId = this.getNodeParameter('accountIdTemplate', i);
        const options = this.getNodeParameter('options', i, {}) as {
          search?: string;
          order?: string;
          page?: number;
          perPage?: number;
          include?: string[];
          query?: string;
        };

        const queryParams: string[] = [];

        if (options.search) queryParams.push(`search=${encodeURIComponent(options.search)}`);
        if (options.order) queryParams.push(`order=${encodeURIComponent(options.order)}`);
        if (options.page) queryParams.push(`page=${options.page}`);
        if (options.perPage) queryParams.push(`perPage=${options.perPage}`);
        if (options.include?.length) queryParams.push(`include=${options.include.join(',')}`);
        if (options.query) queryParams.push(options.query);

        const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
        const endpoint = `/accounts/${accountId}/templates${queryString}`;

        const responseData = await apiRequest.call(this, 'GET', endpoint);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}
