import { IExecuteFunctions } from 'n8n-workflow';
import { IDataObject } from 'n8n-workflow';
import { BaseResource } from './base';

export const templateDescription = {
	displayName: 'Template',
	name: 'template',
	value: 'template',
	operations: [
		{
			displayName: 'Create',
			name: 'operation',
			value: 'createTemplate',
			description: 'Create a template',
			action: 'Create a template',
		},
		{
			displayName: 'List',
			name: 'operation',
			value: 'listTemplates',
			description: 'Get list of templates',
			action: 'Get list of templates',
		},
	],
	properties: [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options',
			displayOptions: { show: { resource: ['template'] } },
			options: [
				{
					name: 'Create',
					value: 'createTemplate',
				},
				{
					name: 'List',
					value: 'listTemplates',
				},
			],
			default: 'createTemplate',
		},
	],
};

export class TemplateResource extends BaseResource {
	static async create(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject> {
		const body = {
			channelId: executeFunctions.getNodeParameter('channelId', index) as string,
			name: executeFunctions.getNodeParameter('templateName', index) as string,
			content: executeFunctions.getNodeParameter('content', index) as string,
			category: executeFunctions.getNodeParameter('category', index) as string,
			language: executeFunctions.getNodeParameter('language', index) as string,
		};

		return await this.makeRequest(executeFunctions, 'POST', '/templates', body, index);
	}

	static async list(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject[]> {
		const channelId = executeFunctions.getNodeParameter('channelId', index) as string;

		const response = await this.makeRequest(executeFunctions, 'GET', `/channels/${channelId}/templates`, {}, index);

		return response.templates as IDataObject[] || [];
	}
}
