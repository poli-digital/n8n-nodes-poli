import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	NodeConnectionType,
} from 'n8n-workflow';

import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class Poli implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Poli',
		name: 'poli',
		icon: 'file:poli.svg',
		group: ['transform'],
		version: 1,
		description: 'Interage com a API da Poli',
		defaults: {
			name: 'Poli',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'poliApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{ name: 'Channel', value: 'channel' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Message', value: 'message' },
				],
				default: 'channel',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['channel', 'contact', 'message'],
					},
				},
				options: [
					{ name: 'List', value: 'list' },
					{ name: 'Send', value: 'send' },
				],
				default: 'list',
				required: true,
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID do cliente (customer)',
			},
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: '',
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: '',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: '',
			},
			{
				displayName: 'Message Text',
				name: 'messageText',
				type: 'string',
				required: false,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;
			const customerId = this.getNodeParameter('customerId', i) as string;

			try {
				if (resource === 'channel' && operation === 'list') {
					const endpoint = `/customers/${customerId}/channels`;
					const response = await apiRequest.call(this, 'GET', endpoint);
					const channels = Array.isArray(response) ? response : [response];
					returnData.push(...channels.map((ch: any) => ({ json: ch })));

				} else if (resource === 'contact' && operation === 'list') {
					const endpoint = `/customers/${customerId}/contacts`;
					const response = await apiRequest.call(this, 'GET', endpoint);
					const contacts = Array.isArray(response) ? response : [response];
					returnData.push(...contacts.map((contact: any) => ({ json: contact })));

				} else if (resource === 'message' && operation === 'send') {
					const channelId = this.getNodeParameter('channelId', i) as string;
					const contactId = this.getNodeParameter('contactId', i) as string;
					const userId = this.getNodeParameter('userId', i) as string;
					const messageText = this.getNodeParameter('messageText', i) as string;

					const endpoint = `/customers/${customerId}/whatsapp/send_text/channels/${channelId}/contacts/${contactId}/users/${userId}`;
					const body = { usermsg: messageText };
					console.log({
	url: endpoint,
	body: { text: messageText },
});

					const response = await apiRequest.call(this, 'POST', endpoint, body);
					returnData.push({ json: response });
				} else {
					throw new NodeApiError(this.getNode(), {
						message: `Resource ${resource} with operation ${operation} not supported.`,
					});
				}
			} catch (error) {
				throw new NodeApiError(this.getNode(), error as any);
			}
		}

		return [returnData];
	}
}
