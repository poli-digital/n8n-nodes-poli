import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
	INodeProperties,
} from 'n8n-workflow';

// Importações dos nodes individuais
import { ListContacts } from './ListContacts.operation';
import { CreateTag } from './CreateTag.operation';
import { CreateApp } from './CreateApp.operation';
import { ListApps } from './ListApps.operation';
import { ListChannels } from './ListChannels.operation';
import { ListTemplates } from './ListTemplates.operation';
import { ListTags } from './ListTags.operation';
import { ListWebhooks } from './ListWebhooks.operation';
import { CreateWebhook } from './CreateWebhook.operation';
import { SendMessageByContactId } from './SendMessageByContactId.operation';
import { SendMessageByPhoneNumber } from './SendMessageByPhoneNumber.operation';
import { SendTemplateByContactId } from './SendTemplateByContactId.node';
import { SendTemplateByPhoneNumber } from './SendTemplateByPhoneNumber.operation';
import { AddTagToContact } from './AddTagToContact.operation';
import { ForwardContact } from './ForwardContact.operation';
import { ListAccounts } from './ListAccounts.operation';
import { GetMe } from './GetMe.operation';
import { ListUsers } from './ListUsers.operation';
import { UpdateContact } from './UpdateContact.operation';
import { ListTeams } from './ListTeams.operation';
import { GetAccountChannel } from './GetAccountChannel.operation'; 

export class Poli implements INodeType {
	description: INodeTypeDescription;

	constructor() {
		const nodes = {
			contact: {
				list: new ListContacts(),
				addTag: new AddTagToContact(),
				forward: new ForwardContact(),
				update: new UpdateContact(),
			},
			app: {
				list: new ListApps(),
				create: new CreateApp(),
			},
			tag: {
				list: new ListTags(),
				create: new CreateTag(),
			},
			message: {
				sendByContactId: new SendMessageByContactId(),
				sendByPhone: new SendMessageByPhoneNumber(),
				sendTemplateByContactId: new SendTemplateByContactId(),
				sendTemplateByPhoneNumber: new SendTemplateByPhoneNumber(),
			},
			channel: {
				list: new ListChannels(),
				get: new GetAccountChannel(),
			},
			template: {
				list: new ListTemplates(),
			},
			webhook: {
				list: new ListWebhooks(),
				create: new CreateWebhook(),
			},
			account: {
				list: new ListAccounts(),
				listUsers: new ListUsers(),
				listTeams: new ListTeams(),
			},
			auth: {
				getMe: new GetMe(),
			},
		};

		const collectProperties = () => {
			const baseProperties: INodeProperties[] = [
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{ name: 'App', value: 'app' },
						{ name: 'Contact', value: 'contact' },
						{ name: 'Channel', value: 'channel' },
						{ name: 'Message', value: 'message' },
						{ name: 'Tag', value: 'tag' },
						{ name: 'Template', value: 'template' },
						{ name: 'Webhook', value: 'webhook' },
						{ name: 'Account', value: 'account' },
						{ name: 'Auth', value: 'auth' },
          ],
					default: 'contact',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['contact'] } },
					options: [
						{ name: 'List', value: 'list', description: 'Listar todos os contatos' },
						{ name: 'Add Tag', value: 'addTag', description: 'Adicionar tag a um contato' },
						{ name: 'Forward', value: 'forward', description: 'Encaminhar contato' },
						{ name: 'Update', value: 'update', description: 'Atualizar um contato' },
					],
					default: 'list',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['app'] } },
					options: [
						{ name: 'List', value: 'list', description: 'Listar aplicações' },
						{ name: 'Create', value: 'create', description: 'Criar nova aplicação' },
					],
					default: 'list',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['tag'] } },
					options: [
						{ name: 'List', value: 'list', description: 'Listar tags' },
						{ name: 'Create', value: 'create', description: 'Criar nova tag' },
					],
					default: 'list',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['message'] } },
					options: [
						{ name: 'Send By Contact ID', value: 'sendByContactId', description: 'Enviar mensagem por ID do contato' },
						{ name: 'Send By Phone', value: 'sendByPhone', description: 'Enviar mensagem por número de telefone' },
						{ name: 'Send Template By Contact ID', value: 'sendTemplateByContactId', description: 'Enviar template por ID do contato' },
						{ name: 'Send Template By Phone Number', value: 'sendTemplateByPhoneNumber', description: 'Enviar template por número de telefone' },
					],
					default: 'sendByContactId',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['channel'] } },
					options: [
						{ name: 'List', value: 'list', description: 'Listar canais' },
						{ name: 'Get', value: 'get', description: 'Obter canal da conta específico' },
					],
					default: 'list',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['template'] } },
					options: [{ name: 'List', value: 'list', description: 'Listar templates' }],
					default: 'list',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['webhook'] } },
					options: [
						{ name: 'List', value: 'list', description: 'Listar webhooks' },
						{ name: 'Create', value: 'create', description: 'Criar webhook' },
					],
					default: 'list',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['account'] } },
					options: [
						{ name: 'List', value: 'list', description: 'Listar contas da organização' },
						{ name: 'List Users', value: 'listUsers', description: 'Listar usuários de uma conta específica' },
						{ name: 'List Teams', value: 'listTeams', description: 'Listar times de uma conta específica' },
					],
					default: 'list',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['auth'] } },
					options: [
						{ name: 'Get Me', value: 'getMe', description: 'Obter informações do usuário autenticado' },
					],
					default: 'getMe',
				},
			];

			const allProperties: INodeProperties[] = [...baseProperties];

			Object.entries(nodes).forEach(([resource, operations]) => {
				Object.entries(operations).forEach(([operation, nodeInstance]) => {
					const nodeProperties = nodeInstance.description.properties || [];

					const specificProperties = nodeProperties.filter(
						(prop) => prop.name !== 'resource' && prop.name !== 'operation',
					);

					specificProperties.forEach((prop) => {
						let modifiedProp: INodeProperties;

						if (resource === 'contact' && operation === 'forward') {
							if (prop.name === 'userUuid') {
								modifiedProp = {
									...prop,
									displayOptions: {
										show: {
											resource: ['contact'],
											operation: ['forward'],
											forwardType: ['user'],
										},
									},
								};
							} else if (prop.name === 'teamUuid') {
								modifiedProp = {
									...prop,
									displayOptions: {
										show: {
											resource: ['contact'],
											operation: ['forward'],
											forwardType: ['team'],
										},
									},
								};
							} else {
								modifiedProp = {
									...prop,
									displayOptions: {
										show: {
											resource: [resource],
											operation: [operation],
										},
									},
								};
							}
						} else {
							modifiedProp = {
								...prop,
								displayOptions: {
									show: {
										resource: [resource],
										operation: [operation],
										...(prop.displayOptions?.show || {}),
									},
								},
							};
						}

						allProperties.push(modifiedProp);
					});
				});
			});

			return allProperties;
		};

		this.description = {
			displayName: 'Poli',
			name: 'poli',
			icon: 'file:poli.svg',
			group: ['output'],
			version: 1,
			description: 'Node principal para interagir com a API da Poli',
			defaults: { name: 'Poli' },
			inputs: ['main'],
			outputs: ['main'],
			credentials: [{ name: 'poliApi', required: true }],
			properties: collectProperties(),
		};
	}

	async execute(this: IExecuteFunctions) {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const nodeMap: Record<string, Record<string, any>> = {
			contact: {
				list: new ListContacts(),
				addTag: new AddTagToContact(),
				forward: new ForwardContact(),
				update: new UpdateContact(),
			},
			app: {
				list: new ListApps(),
				create: new CreateApp(),
			},
			tag: {
				list: new ListTags(),
				create: new CreateTag(),
			},
			message: {
				sendByContactId: new SendMessageByContactId(),
				sendByPhone: new SendMessageByPhoneNumber(),
				sendTemplateByContactId: new SendTemplateByContactId(),
				sendTemplateByPhoneNumber: new SendTemplateByPhoneNumber(),
			},
			channel: {
				list: new ListChannels(),
				get: new GetAccountChannel(),
			},
			template: {
				list: new ListTemplates(),
			},
			webhook: {
				list: new ListWebhooks(),
				create: new CreateWebhook(),
			},
			account: {
				list: new ListAccounts(),
				listUsers: new ListUsers(),
				listTeams: new ListTeams(),
			},
			auth: {
				getMe: new GetMe(),
			},
		};

		const resourceNodes = nodeMap[resource];
		if (!resourceNodes) throw new Error(`Resource '${resource}' não encontrado`);

		const targetNode = resourceNodes[operation];
		if (!targetNode) throw new Error(`Operação '${operation}' não encontrada para o resource '${resource}'`);

		return await targetNode.execute.call(this);
	}
}