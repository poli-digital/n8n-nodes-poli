import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject } from 'n8n-workflow';
import { BaseResource } from './base';

export const contactDescription = {
	displayName: 'Contact',
	name: 'contact',
	value: 'contact',
	operations: [
		{
			displayName: 'Create',
			name: 'operation',
			value: 'createContact',
			description: 'Create a new contact',
			action: 'Create a contact',
		},
		{
			displayName: 'Get',
			name: 'operation',
			value: 'getContact',
			description: 'Get a contact',
			action: 'Get a contact',
		},
		{
			displayName: 'Update',
			name: 'operation',
			value: 'updateContact',
			description: 'Update a contact',
			action: 'Update a contact',
		},
		{
			displayName: 'Add Tag to Contact',
			name: 'addTagToContact',
			value: 'addTagToContact',
			description: 'Adiciona uma tag a um contato',
			action: 'Add a tag to a contact',
		},
	],
	properties: [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			displayOptions: { show: { resource: ['contact'] } },
			options: [
				{
					name: 'Create',
					value: 'createContact',
				},
				{
					name: 'Get',
					value: 'getContact',
				},
				{
					name: 'Update',
					value: 'updateContact',
				},
				{
					name: 'Add Tag to Contact',
					value: 'addTagToContact',
				},
			],
			default: 'createContact',
		},
	],
};

export class ContactResource extends BaseResource {
	static async create(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject> {
		const body = {
			applicationId: executeFunctions.getNodeParameter('applicationId', index) as string,
			name: executeFunctions.getNodeParameter('contactName', index) as string,
			phone: executeFunctions.getNodeParameter('phone', index) as string,
			email: executeFunctions.getNodeParameter('email', index) as string,
		};

		return await this.makeRequest(executeFunctions, 'POST', '/contacts', body, index);
	}

	static async get(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject> {
		const contactId = executeFunctions.getNodeParameter('contactId', index) as string;

		return await this.makeRequest(executeFunctions, 'GET', `/contacts/${contactId}`, {}, index);
	}

	static async update(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject> {
		const contactId = executeFunctions.getNodeParameter('contactId', index) as string;
		const updateFields = executeFunctions.getNodeParameter('updateFields', index) as IDataObject;

		return await this.makeRequest(executeFunctions, 'PUT', `/contacts/${contactId}`, updateFields, index);
	}

	static async addTagToContact(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject> {
		const contactUuid = executeFunctions.getNodeParameter('contactUuid', index) as string;
		const tagUuid = executeFunctions.getNodeParameter('tagUuid', index) as string;

		const body = {
			tags: [tagUuid],
		};

		return await this.makeRequest(executeFunctions, 'POST', `/contacts/${contactUuid}/tags`, body, index);
	}
}
