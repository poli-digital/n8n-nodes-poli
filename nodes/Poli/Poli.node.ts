import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
} from 'n8n-workflow';

// Importações dos nodes existentes
import { ListContacts } from './ListContacts.operation';
import { CreateContact } from './CreateContact.operation';
import { UpdateContact } from './UpdateContact.operation';
import { AddTagToContact } from './AddTagToContact.operation';
import { ForwardContact } from './ForwardContact.operation';

import { ListApps } from './ListApps.operation';
import { CreateApp } from './CreateApp.operation';
import { GetMe } from './GetMe.operation'; // será usado como Get App Data

import { ListAccounts } from './ListAccounts.operation';

import { ListChannels } from './ListChannels.operation';

import { SendMessageByContactId } from './SendMessageByContactId.operation';
import { SendMessageByPhoneNumber } from './SendMessageByPhoneNumber.operation';

import { ListTemplates } from './ListTemplates.operation';
import { SendTemplateByContactId } from './SendTemplateByContactId.node';
import { SendTemplateByPhoneNumber } from './SendTemplateByPhoneNumber.operation';

import { ListTags } from './ListTags.operation';
import { CreateTag } from './CreateTag.operation';

import { ListUsers } from './ListUsers.operation';

import { ListTeams } from './ListTeams.operation';

import { ListWebhooks } from './ListWebhooks.operation';
import { CreateWebhook } from './CreateWebhook.operation';

export class Poli implements INodeType {
	description: INodeTypeDescription;

	constructor() {
		const nodes = {
			app: {
				list: new ListApps(),
				create: new CreateApp(),
				getData: new GetMe(), // Get App Data
			},
			account: {
				list: new ListAccounts(),
			},
			channel: {
				list: new ListChannels(),
			},
			message: {
				sendByContactId: new SendMessageByContactId(),
				sendByPhone: new SendMessageByPhoneNumber(),
			},
			template: {
				list: new ListTemplates(),
				sendByContactId: new SendTemplateByContactId(),
				sendByPhone: new SendTemplateByPhoneNumber(),
			},
			contact: {
				list: new ListContacts(),
				create: new CreateContact(),
				update: new UpdateContact(),
				addTag: new AddTagToContact(),
				forward: new ForwardContact(),
			},
			tag: {
				list: new ListTags(),
				create: new CreateTag(),
			},
			user: {
				list: new ListUsers(),
			},
			team: {
				list: new ListTeams(),
			},
			webhook: {
				list: new ListWebhooks(),
				create: new CreateWebhook(),
			},
		};

		const collectProperties = (): INodeProperties[] => {
			const baseProperties: INodeProperties[] = [
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{ name: 'App', value: 'app' },
						{ name: 'Account', value: 'account' },
						{ name: 'Channel', value: 'channel' },
						{ name: 'Message', value: 'message' },
						{ name: 'Template', value: 'template' },
						{ name: 'Contact', value: 'contact' },
						{ name: 'Tag', value: 'tag' },
						{ name: 'User', value: 'user' },
						{ name: 'Team', value: 'team' },
						{ name: 'Webhook', value: 'webhook' },
					],
					default: 'contact',
				},
				// APP ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['app'] } },
					options: [
						{ name: 'List Apps', value: 'list', action: 'List Apps' },
						{ name: 'Create App', value: 'create', action: 'Create App' },
						{ name: 'Get App Data', value: 'getData', action: 'Get App Data' },
					],
					default: 'list',
				},
				// ACCOUNT ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['account'] } },
					options: [{ name: 'List Accounts', value: 'list', action: 'List Accounts' }],
					default: 'list',
				},
				// CHANNEL ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['channel'] } },
					options: [{ name: 'List Channels', value: 'list', action: 'List Channels' }],
					default: 'list',
				},
				// MESSAGE ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['message'] } },
					options: [
						{ name: 'Send Message By Contact ID', value: 'sendByContactId', action: 'Send Message By Contact ID' },
						{ name: 'Send Message By Phone', value: 'sendByPhone', action: 'Send Message By Phone' },
					],
					default: 'sendByContactId',
				},
				// TEMPLATE ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['template'] } },
					options: [
						{ name: 'List Templates', value: 'list', action: 'List Templates' },
						{ name: 'Send Template Message By Contact ID', value: 'sendByContactId', action: 'Send Template Message By Contact ID' },
						{ name: 'Send Template Message By Phone Number', value: 'sendByPhone', action: 'Send Template Message By Phone Number' },
					],
					default: 'list',
				},
				// CONTACT ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['contact'] } },
					options: [
						{ name: 'List and Search Contacts', value: 'list', action: 'List and Search Contacts' },
						{ name: 'Create Contact', value: 'create', action: 'Create Contact' },
						{ name: 'Update Contact', value: 'update', action: 'Update Contact' },
						{ name: 'Add Tag to Contact', value: 'addTag', action: 'Add Tag to Contact' },
						{ name: 'Forward Contact', value: 'forward', action: 'Forward Contact' },
					],
					default: 'list',
				},
				// TAG ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['tag'] } },
					options: [
						{ name: 'List Tags', value: 'list', action: 'List Tags' },
						{ name: 'Create Tags', value: 'create', action: 'Create Tags' },
					],
					default: 'list',
				},
				// USER ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['user'] } },
					options: [{ name: 'List and Search Users', value: 'list', action: 'List and Search Users' }],
					default: 'list',
				},
				// TEAM ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['team'] } },
					options: [{ name: 'List Teams', value: 'list', action: 'List Teams' }],
					default: 'list',
				},
				// WEBHOOK ACTIONS
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: { show: { resource: ['webhook'] } },
					options: [
						{ name: 'List Webhooks', value: 'list', action: 'List Webhooks' },
						{ name: 'Create Webhook', value: 'create', action: 'Create Webhook' },
					],
					default: 'list',
				},
			];

			const allProperties: INodeProperties[] = [...baseProperties];

			Object.entries(nodes).forEach(([resource, operations]) => {
				Object.entries(operations).forEach(([operation, nodeInstance]) => {
					const nodeProperties = nodeInstance.description?.properties || [];

					const specificProperties = nodeProperties.filter(
						(prop) => prop.name !== 'resource' && prop.name !== 'operation',
					);

					specificProperties.forEach((prop) => {
						const modifiedProp: INodeProperties = {
							...prop,
							displayOptions: {
								show: {
									resource: [resource],
									operation: [operation],
									...(prop.displayOptions?.show || {}),
								},
							},
						};
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
			app: {
				list: new ListApps(),
				create: new CreateApp(),
				getData: new GetMe(), // Get App Data
			},
			account: {
				list: new ListAccounts(),
			},
			channel: {
				list: new ListChannels(),
			},
			message: {
				sendByContactId: new SendMessageByContactId(),
				sendByPhone: new SendMessageByPhoneNumber(),
			},
			template: {
				list: new ListTemplates(),
				sendByContactId: new SendTemplateByContactId(),
				sendByPhone: new SendTemplateByPhoneNumber(),
			},
			contact: {
				list: new ListContacts(),
				create: new CreateContact(),
				update: new UpdateContact(),
				addTag: new AddTagToContact(),
				forward: new ForwardContact(),
			},
			tag: {
				list: new ListTags(),
				create: new CreateTag(),
			},
			user: {
				list: new ListUsers(),
			},
			team: {
				list: new ListTeams(),
			},
			webhook: {
				list: new ListWebhooks(),
				create: new CreateWebhook(),
			},
		};

		const resourceNodes = nodeMap[resource];
		if (!resourceNodes) throw new Error(`Resource '${resource}' não encontrado`);

		const targetNode = resourceNodes[operation];
		if (!targetNode) throw new Error(`Operação '${operation}' não encontrada para o resource '${resource}'`);

		return await targetNode.execute.call(this);
	}
}
