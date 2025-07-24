import { IExecuteFunctions, INodeProperties, JsonObject, NodeApiError } from 'n8n-workflow';
import { apiRequest } from '../transport'; // Ajuste o caminho do import, se necessário

/**
 * Propriedades da UI para a operação 'List Contacts'
 */
export const listContactsFields: INodeProperties[] = [
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
				typeOptions: { minValue: 1 },
				description: 'Número da página',
			},
			{
				displayName: 'Per Page',
				name: 'perPage',
				type: 'number',
				default: 20,
				typeOptions: { minValue: 1, maxValue: 100 },
				description: 'Itens por página',
			},
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Type', value: 'type' },
					{ name: 'Chat Status', value: 'chat_status' },
					{ name: 'Read Status', value: 'read_status' },
					{ name: 'Attributes', value: 'attributes' },
					{ name: 'Account', value: 'account' },
					{ name: 'Attendant', value: 'attendant' },
					{ name: 'Contact Channels', value: 'contact_channels' },
					{ name: 'Current Attendance', value: 'current_attendance' },
					{ name: 'Last Message', value: 'last_message' },
					{ name: 'Tags', value: 'tags' },
					{ name: 'Addresses', value: 'addresses' },
					{ name: 'Metadata', value: 'metadata' },
				],
				default: [],
				description: 'Campos adicionais para incluir na resposta',
			},
		],
	},
];

/**
 * Lógica de execução para a operação 'List Contacts'
 */
export async function executeListContacts(this: IExecuteFunctions): Promise<any> {
	const items = this.getInputData();
	const returnData = [];

	for (let i = 0; i < items.length; i++) {
		try {
			// 'accountId' será lido do campo global do node principal
			const accountId = this.getNodeParameter('accountId', i) as string;
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
			if (options.include?.length) qs.include = options.include.join(',');
			if (options.query) qs.query = JSON.stringify(options.query);

			const endpoint = `/accounts/${accountId}/contacts`;
			const responseData = await apiRequest.call(this, 'GET', endpoint, {}, qs);
			returnData.push({ json: responseData });
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	return [returnData];
}