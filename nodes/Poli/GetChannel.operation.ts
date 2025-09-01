import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	INodeProperties,
} from 'n8n-workflow';
import { apiRequest } from './transport';

export const getChannelFields: INodeProperties[] = [
	{
		displayName: 'Account Channel UUID',
		name: 'accountChannelUuid',
		type: 'string',
		default: '',
		required: true,
		description: 'UUID do canal da conta',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Config', value: 'config' },
				],
				default: [],
				description: 'Campos adicionais para incluir na resposta',
			},
		],
	},
];

export async function executeGetChannel(this: IExecuteFunctions): Promise<any> {
	const items = this.getInputData();
	const returnData = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const accountChannelUuid = this.getNodeParameter('accountChannelUuid', i) as string;
			const options = this.getNodeParameter('options', i, {}) as {
				include?: string[];
			};

			const params = new URLSearchParams();

			if (options.include?.length) {
				params.append('include', options.include.join(','));
			}

			const queryString = params.toString();
			const endpoint = `/account-channels/${accountChannelUuid}${queryString ? `?${queryString}` : ''}`;

			const responseData = await apiRequest.call(this, 'GET', endpoint);
			returnData.push({ json: responseData });
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	return [returnData];
}

export class GetChannel implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Get Channel',
		name: 'getChannel',
		group: ['output'],
		version: 1,
		description: 'Get channel from Poli API',
		defaults: {
			name: 'Get Channel',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: getChannelFields,
	};

	async execute(this: IExecuteFunctions): Promise<any> {
		return executeGetChannel.call(this);
	}
}
