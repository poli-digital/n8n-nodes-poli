import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	IDataObject,
	INodeExecutionData,
	JsonObject,
} from 'n8n-workflow';

import { apiRequest } from './transport';
import { NodeApiError } from 'n8n-workflow';

interface IWebhookStorage {
	webhookUrl: string;
	applicationId: string;
	events: string[];
}

export class PoliTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Poli Trigger',
		name: 'poliTrigger',
		icon: 'file:poli.svg',
		group: ['trigger'],
		version: 1,
		description: 'Trigger para receber webhooks da API da Poli',
		defaults: {
			name: 'Poli Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'poliApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{$parameter["webhookPath"]}}',
				isStatic: false,
			},
		],
		properties: [
			{
				displayName: 'App Name',
				name: 'appName',
				type: 'string',
				default: '',
				required: true,
				description: 'Nome do app que será criado na Poli',
			},
			{
				displayName: 'Eventos',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Message Received',
						value: 'message.received',
						description: 'Quando uma nova mensagem é recebida',
					},
					{
						name: 'Message Status Updated',
						value: 'message.status',
						description: 'Quando o status de uma mensagem é atualizado',
					},
					{
						name: 'Contact Updated',
						value: 'contact.updated',
						description: 'Quando um contato é atualizado',
					},
					{
						name: 'Contact Created',
						value: 'contact.created',
						description: 'Quando um novo contato é criado',
					},
				],
				default: ['message.received'],
				required: true,
				description: 'Eventos que serão monitorados',
			},
			{
				displayName: 'Webhook Path',
				name: 'webhookPath',
				type: 'string',
				default: 'poli',
				required: true,
				description: 'Path customizado para a URL do webhook',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;

		if (!bodyData) {
			throw new Error('Nenhum dado recebido no webhook');
		}

		const returnData: IDataObject = {
			...bodyData,
			webhookReceivedAt: new Date().toISOString(),
			webhookHeaders: headers,
			_debug: {
				receivedData: true,
				dataValidated: true,
			},
		};

		const event = bodyData.event as string;
		if (event) {
			const knownEvents = [
				'message.received',
				'message.status',
				'contact.updated',
				'contact.created',
			];

			if (!knownEvents.includes(event)) {
				returnData._debug = {
					...returnData._debug as object,
					warning: `Evento desconhecido recebido: ${event}`,
					knownEvents,
				};
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray([returnData])],
		};
	}

	async activate(this: IWebhookFunctions): Promise<void> {
		const credentials = await this.getCredentials('poliApi');
		
		// Construir a URL do webhook usando as variáveis de ambiente
		const webhookHost = process.env.WEBHOOK_URL || 'http://localhost:5678';
		const webhookEndpoint = process.env.N8N_ENDPOINT_WEBHOOK_TEST || 'webhook-test';
		const webhookPath = this.getNodeParameter('webhookPath', 0) as string;
		const webhookUrl = `${webhookHost}/${webhookEndpoint}/${webhookPath}`;

		console.log('Webhook URL construída:', webhookUrl);

		const accountUuid = credentials.accountUuid as string;
		const events = this.getNodeParameter('events', 0) as string[];
		const appName = this.getNodeParameter('appName', 0) as string;

		try {
			// Verificar se já existe uma aplicação com este nome
			const appsResponse = await apiRequest.call(
				this as unknown as IExecuteFunctions,
				'GET',
				`/accounts/${accountUuid}/applications?include=attributes`,
			);

			let applicationId: string;
			let existingApp: any = null;

			if (appsResponse.data && Array.isArray(appsResponse.data)) {
				existingApp = appsResponse.data.find((app: any) => 
					app.attributes && app.attributes.name === appName
				);
			}

			if (existingApp) {
				applicationId = existingApp.id;
				console.log('Usando aplicação existente:', applicationId);
			} else {
				// Criar nova aplicação
				const appData = {
					visibility: 'PRIVATE',
					attributes: {
						name: appName,
						description: 'App criado automaticamente pelo n8n para receber webhooks',
						responsible: 'n8n',
						email: 'n8n@poli.digital',
						phone: '0000000000',
					},
				};

				const appResponse = await apiRequest.call(
					this as unknown as IExecuteFunctions,
					'POST',
					`/accounts/${accountUuid}/applications?include=attributes`,
					appData,
				);

				if (!appResponse.data || !appResponse.data.id) {
					throw new Error('Erro ao criar app na Poli');
				}

				applicationId = appResponse.data.id;
				console.log('Nova aplicação criada:', applicationId);
			}

			// Verificar se já existe um webhook com esta URL
			const webhooksResponse = await apiRequest.call(
				this as unknown as IExecuteFunctions,
				'GET',
				`/applications/${applicationId}/webhooks?include=url,subscriptions`,
			);

			let webhookExists = false;
			if (webhooksResponse.data && Array.isArray(webhooksResponse.data)) {
				webhookExists = webhooksResponse.data.some((webhook: any) => 
					webhook.url === webhookUrl
				);
			}

			if (!webhookExists) {
				// Criar novo webhook
				const webhookData = {
					url: webhookUrl,
					subscriptions: events,
				};

				await apiRequest.call(
					this as unknown as IExecuteFunctions,
					'POST',
					`/applications/${applicationId}/webhooks?include=url,subscriptions`,
					webhookData,
				);

				console.log('Webhook criado com sucesso:', webhookUrl);
			} else {
				console.log('Webhook já existe:', webhookUrl);
			}

		} catch (error) {
			console.error('Erro ao ativar webhook:', error);
			throw new NodeApiError(this.getNode(), error as unknown as JsonObject);
		}
	}

	async deactivate(this: IWebhookFunctions): Promise<void> {
		const credentials = await this.getCredentials('poliApi');
		const accountUuid = credentials.accountUuid as string;
		const appName = this.getNodeParameter('appName', 0) as string;

		try {
			// Buscar aplicações por nome
			const appsResponse = await apiRequest.call(
				this as unknown as IExecuteFunctions,
				'GET',
				`/accounts/${accountUuid}/applications?include=attributes`,
			);

			if (appsResponse.data && Array.isArray(appsResponse.data)) {
				const app = appsResponse.data.find((app: any) => 
					app.attributes && app.attributes.name === appName
				);

				if (app && app.id) {
					// Buscar webhooks da aplicação
					const webhooksResponse = await apiRequest.call(
						this as unknown as IExecuteFunctions,
						'GET',
						`/applications/${app.id}/webhooks?include=url,subscriptions`,
					);

					if (webhooksResponse.data && Array.isArray(webhooksResponse.data)) {
						// Deletar todos os webhooks da aplicação
						for (const webhook of webhooksResponse.data) {
							await apiRequest.call(
								this as unknown as IExecuteFunctions,
								'DELETE',
								`/applications/${app.id}/webhooks/${webhook.id}`,
							);
						}
					}
				}
			}
		} catch (error) {
			console.error('Erro ao desativar webhook:', error);
			// Não lançar erro para não bloquear a desativação
		}
	}
}
