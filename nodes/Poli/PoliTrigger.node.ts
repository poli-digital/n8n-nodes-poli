import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';

import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';
import { getParameterSafe } from './utils/parameterUtils';

export class PoliTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Trigger',
		name: 'poliTrigger',
		icon: 'file:poli.svg',
		group: ['trigger'],
		version: 1,
		description: 'Trigger para receber webhooks da API da Poli',
		defaults: {
			name: 'Trigger',
		},
		subtitle: '={{ $parameter["appName"] }}',
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
					{ name: 'Message Received', value: 'message.received' },
					{ name: 'Message Status Updated', value: 'message.status' },
					{ name: 'Contact Updated', value: 'contact.updated' },
					{ name: 'Contact Created', value: 'contact.created' },
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
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				required: false,
				description: 'Número da página para listar os aplicativos',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;

		if (!bodyData) {
			throw new Error('Nenhum dado recebido no webhook');
		}

		// Log para debug
		console.log('📥 Webhook recebido:', JSON.stringify(bodyData, null, 2));

		// Identifica o evento
		const event = bodyData.event || bodyData.type || 'evento_não_identificado';

		// Remove informações inúteis
		const filtered = Object.keys(bodyData)
			.filter((key) => !['_debug', 'webhookReceivedAt', 'webhookHeaders', 'baggage', 'x-request-id', 'x-real-ip'].includes(key))
			.reduce((acc, key) => {
				acc[key] = bodyData[key];
				return acc;
			}, {} as IDataObject);

		// Organiza a saída com base no tipo de evento
		const structuredOutput: IDataObject = {
			event,
			timestamp: new Date().toISOString(),
			payload: filtered,
		};

		return {
			workflowData: [this.helpers.returnJsonArray([structuredOutput])],
		};
	}

	async activate(this: IWebhookFunctions): Promise<void> {
		const credentials = await this.getCredentials('poliApi');
		const webhookHost = process.env.WEBHOOK_URL || 'http://localhost:5678';
		const webhookEndpoint = process.env.N8N_ENDPOINT_WEBHOOK || 'webhook';
		let webhookPath: string;
		let events: string[];
		let appName: string;
		let page: number;

		try {
			webhookPath = this.getNodeParameter('webhookPath', 0) as string || 'poli';
		} catch (error) {
			console.warn('⚠️ Parâmetro "webhookPath" não encontrado, usando fallback: "poli"');
			webhookPath = 'poli';
		}

		if (!webhookPath || typeof webhookPath !== 'string') {
			throw new Error('❌ Parâmetro "webhookPath" é obrigatório e deve ser uma string válida');
		}

		const webhookUrl = `${webhookHost}/${webhookEndpoint}/${webhookPath}`;

		console.log('🚀 URL de webhook:', webhookUrl);

		const accountUuid = credentials.accountUuid as string;

		try {
			events = this.getNodeParameter('events', 0) as string[] || ['message.received'];
		} catch (error) {
			console.warn('⚠️ Parâmetro "events" não encontrado, usando fallback: ["message.received"]');
			events = ['message.received'];
		}

		if (!events || !Array.isArray(events) || events.length === 0) {
			throw new Error('❌ Parâmetro "events" é obrigatório e deve ser um array com pelo menos um evento');
		}

		try {
			appName = this.getNodeParameter('appName', 0) as string;
		} catch (error) {
			console.warn('⚠️ Parâmetro "appName" não encontrado');
			throw new Error('❌ Parâmetro "appName" é obrigatório');
		}

		if (!appName || typeof appName !== 'string') {
			throw new Error('❌ Parâmetro "appName" é obrigatório e deve ser uma string válida');
		}

		try {
			page = this.getNodeParameter('page', 0) as number || 1;
		} catch (error) {
			console.warn('⚠️ Parâmetro "page" não encontrado, usando fallback: 1');
			page = 1;
		}

		const perPage = 100;

		try {
			// Verifica se app já existe
			const appsResponse = await apiRequest.call(
				this as unknown as IExecuteFunctions,
				'GET',
				`/accounts/${accountUuid}/applications?include=attributes&perPage=${perPage}&page=${page}`
			);

			let applicationId: string;
			const existingApp = appsResponse.data?.find((app: any) => app.attributes?.name === appName);

			if (existingApp) {
				applicationId = existingApp.id;
				console.log('🟢 App existente encontrado:', applicationId);
			} else {
				const appData = {
					visibility: 'PRIVATE',
					attributes: {
						name: appName,
						description: 'App criado pelo n8n para webhooks',
						responsible: 'n8n',
						email: 'n8n@poli.digital',
						phone: '0000000000',
					},
				};

				const appResponse = await apiRequest.call(
					this as unknown as IExecuteFunctions,
					'POST',
					`/accounts/${accountUuid}/applications?include=attributes`,
					appData
				);

				applicationId = appResponse.data.id;
				console.log('🆕 Novo app criado:', applicationId);
			}

			// Verifica se webhook já existe
			const webhooksResponse = await apiRequest.call(
				this as unknown as IExecuteFunctions,
				'GET',
				`/applications/${applicationId}/webhooks?include=url,subscriptions`
			);

			const webhookExists = webhooksResponse.data?.some((webhook: any) => webhook.url === webhookUrl);

			if (!webhookExists) {
				const webhookData = {
					url: webhookUrl,
					subscriptions: events,
				};

				await apiRequest.call(
					this as unknown as IExecuteFunctions,
					'POST',
					`/applications/${applicationId}/webhooks?include=url,subscriptions`,
					webhookData
				);

				console.log('✅ Webhook criado:', webhookUrl);
			} else {
				console.log('ℹ️ Webhook já registrado:', webhookUrl);
			}
		} catch (error) {
			console.error('❌ Erro ao ativar webhook:', error);
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	async deactivate(this: IWebhookFunctions): Promise<void> {
		const credentials = await this.getCredentials('poliApi');
		const accountUuid = credentials.accountUuid as string;
		
		let appName: string;
		try {
			appName = this.getNodeParameter('appName', 0) as string;
		} catch (error) {
			console.warn('⚠️ Parâmetro "appName" não encontrado durante desativação');
			return; // Se não temos o nome do app, não podemos desativar
		}

		if (!appName || typeof appName !== 'string') {
			console.warn('⚠️ Nome do app inválido durante desativação');
			return;
		}

		try {
			const appsResponse = await apiRequest.call(
				this as unknown as IExecuteFunctions,
				'GET',
				`/accounts/${accountUuid}/applications?include=attributes`
			);

			const app = appsResponse.data?.find((app: any) => app.attributes?.name === appName);

			if (app?.id) {
				const webhooksResponse = await apiRequest.call(
					this as unknown as IExecuteFunctions,
					'GET',
					`/applications/${app.id}/webhooks?include=url,subscriptions`
				);

				for (const webhook of webhooksResponse.data || []) {
					await apiRequest.call(
						this as unknown as IExecuteFunctions,
						'DELETE',
						`/applications/${app.id}/webhooks/${webhook.id}`
					);
				}

				console.log('🧹 Webhooks removidos com sucesso');
			}
		} catch (error) {
			console.error('⚠️ Erro ao desativar webhook:', error);
			// Não lança erro para evitar bloqueio de desativação
		}
	}
}
