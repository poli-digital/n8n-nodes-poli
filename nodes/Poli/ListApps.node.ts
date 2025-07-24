import { IExecuteFunctions, INodeProperties, JsonObject, NodeApiError } from 'n8n-workflow';
import { apiRequest } from '../transport'; // Ajuste o caminho do import se necessário

/**
 * Propriedades da UI para a operação 'List Apps'
 */
export const listAppsFields: INodeProperties[] = [
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
				description: 'Search term to filter the results',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'string',
				default: '',
				description: 'Ordering of the results (e.g. -created_at)',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				description: 'Page number to fetch',
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
					{ name: 'Status', value: 'status' },
					{ name: 'Visibility', value: 'visibility' },
                    // ...outras opções de include
				],
				default: [],
				description: 'Additional fields to include in the response',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Raw query string (e.g. id=18&name=gabriel)',
			},
		],
	},
];

/**
 * Lógica de execução para a operação 'List Apps'
 */
export async function executeListApps(this: IExecuteFunctions): Promise<any> {
	const items = this.getInputData();
	const returnData = [];

	for (let i = 0; i < items.length; i++) {
		try {
			// O 'accountId' agora vem do campo global do node principal
			const accountId = this.getNodeParameter('accountId', i) as string;
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

			// O endpoint usa 'applications', que é o plural de 'app'. Vamos padronizar isso.
			const endpoint = `/accounts/${accountId}/applications?${params.toString()}`;
			const responseData = await apiRequest.call(this, 'GET', endpoint);
			returnData.push({ json: responseData });

		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	return [returnData];
}