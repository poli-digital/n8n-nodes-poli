import { IExecuteFunctions, INodeProperties, JsonObject, NodeApiError } from 'n8n-workflow';
import { apiRequest } from '../transport'; // Ajuste o caminho do import se necessário

/**
 * Propriedades da UI para a operação 'List Webhooks'
 */
export const listWebhooksFields: INodeProperties[] = [
	{
		displayName: 'Application ID',
		name: 'applicationId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the application to list webhooks from',
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
				default: 50,
			},
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Status', value: 'status' },
					{ name: 'URL', value: 'url' },
					{ name: 'Subscriptions', value: 'subscriptions' },
					{ name: 'Application', value: 'application' },
					{ name: 'Metadata', value: 'metadata' },
                    // ...outras opções relevantes...
				],
				default: [],
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
			},
		],
	},
];

/**
 * Lógica de execução para a operação 'List Webhooks'
 */
export async function executeListWebhooks(this: IExecuteFunctions): Promise<any> {
	const items = this.getInputData();
	const returnData = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const applicationId = this.getNodeParameter('applicationId', i) as string;
			const options = this.getNodeParameter('options', i, {}) as {
				search?: string;
				order?: string;
				page?: number;
				perPage?: number;
				include?: string[];
				query?: string;
			};

			const params = new URLSearchParams();

			if (options.search) params.append('search', options.search);
			if (options.order) params.append('order', options.order);
			if (options.page) params.append('page', String(options.page));
			if (options.perPage) params.append('perPage', String(options.perPage));
			if (options.include?.length) params.append('include', options.include.join(','));

			if (options.query) {
				for (const part of options.query.split('&')) {
					const [key, value] = part.split('=');
					if (key && value) {
						params.append(key.trim(), value.trim());
					}
				}
			}

			const endpoint = `/applications/${applicationId}/webhooks?${params.toString()}`;
			const responseData = await apiRequest.call(this, 'GET', endpoint);
			returnData.push({ json: responseData });

		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	return [returnData];
}