import { IExecuteFunctions, INodeType, INodeTypeDescription, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class ListChannels implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'List Channels',
    name: 'listChannels',
    icon: 'file:poli.svg',
    group: ['output'],
    version: 1,
    description: 'List all channels',
    defaults: {
      name: 'List Channels',
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
        name: 'customerId',
        type: 'string',
        default: '',
        required: true,
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
            description: 'Texto para busca',
          },
          {
            displayName: 'Query (JSON)',
            name: 'query',
            type: 'json',
            default: '',
            description: 'Filtro avançado no formato JSON',
          },
          {
            displayName: 'Order',
            name: 'order',
            type: 'string',
            default: '',
            description: 'Campo e direção de ordenação, ex: created_at desc',
          },
          {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            default: 1,
            typeOptions: {
              minValue: 1,
            },
            description: 'Número da página',
          },
          {
            displayName: 'Per Page',
            name: 'perPage',
            type: 'number',
            default: 20,
            typeOptions: {
              minValue: 1,
              maxValue: 100,
            },
            description: 'Itens por página',
          },
          {
            displayName: 'Include',
            name: 'include',
            type: 'multiOptions',
            options: [
              { name: 'UID', value: 'uid' },
              { name: 'Name', value: 'name' },
              { name: 'Status', value: 'status' },
              { name: 'Provider', value: 'provider' },
              { name: 'Integrator', value: 'integrator' },
              { name: 'Config', value: 'config' },
              { name: 'Metadata', value: 'metadata' },
            ],
            default: [],
            description: 'Campos adicionais para incluir na resposta',
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
        const customerId = this.getNodeParameter('customerId', i);
        const options = this.getNodeParameter('options', i, {}) as {
          search?: string;
          order?: string;
          page?: number;
          perPage?: number;
          include?: string[];
          query?: JsonObject;
        };

        const qs: { [key: string]: string } = {};

        if (options.search) qs.search = options.search;
        if (options.order) qs.order = options.order;
        if (options.page) qs.page = options.page.toString();
        if (options.perPage) qs.perPage = options.perPage.toString();
        if (options.include && options.include.length > 0) {
          qs.include = options.include.join(',');
        }
        if (options.query) {
          qs.query = JSON.stringify(options.query);
        }

        const endpoint = `/accounts/${customerId}/account-channels`;
        const responseData = await apiRequest.call(this, 'GET', endpoint, {}, qs);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}
