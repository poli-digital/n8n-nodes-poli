import { IExecuteFunctions, IDataObject, NodePropertyTypes } from 'n8n-workflow';
import { IResourceDescription } from '../interfaces/common';
import { BaseResource } from './base';

export const channelDescription: IResourceDescription = {
	displayName: 'Channel',
	name: 'channel',
	value: 'channel',
	operations: [
		{
			displayName: 'Create',
			name: 'operation',
			value: 'createChannel',
			description: 'Create a new channel',
			action: 'Create a channel',
		},
		{
			displayName: 'List',
			name: 'operation',
			value: 'listChannels',
			description: 'Get list of channels',
			action: 'Get list of channels',
		},
	],
	properties: [
		{
			displayName: 'Operation',
			name: 'operation',
			type: 'options' as NodePropertyTypes,
			displayOptions: { show: { resource: ['channel'] } },
			options: [
				{
					name: 'Create',
					value: 'createChannel',
				},
				{
					name: 'List',
					value: 'listChannels',
				},
			],
			default: 'createChannel',
			description: 'The operation to perform',
		},
		// Channel operation parameters
		{
			displayName: 'Application ID',
			name: 'applicationId',
			type: 'string' as NodePropertyTypes,
			required: true,
			displayOptions: {
				show: {
					resource: ['channel'],
					operation: ['createChannel', 'listChannels'],
				},
			},
			default: '',
			description: 'The ID of the application',
		},
		{
			displayName: 'Channel Name',
			name: 'channelName',
			type: 'string' as NodePropertyTypes,
			required: true,
			displayOptions: {
				show: {
					resource: ['channel'],
					operation: ['createChannel'],
				},
			},
			default: '',
			description: 'The name of the channel',
		},
		{
			displayName: 'Channel Type',
			name: 'channelType',
			type: 'options' as NodePropertyTypes,
			required: true,
			displayOptions: {
				show: {
					resource: ['channel'],
					operation: ['createChannel'],
				},
			},
			options: [
				{
					name: 'WhatsApp',
					value: 'whatsapp',
				},
				{
					name: 'Webchat',
					value: 'webchat',
				},
				{
					name: 'Instagram',
					value: 'instagram',
				},
			],
			default: 'whatsapp',
			description: 'The type of channel',
		},
		{
			displayName: 'Channel Configuration',
			name: 'config',
			type: 'json' as NodePropertyTypes,
			required: true,
			displayOptions: {
				show: {
					resource: ['channel'],
					operation: ['createChannel'],
				},
			},
			default: '{}',
			description: 'The channel configuration in JSON format',
		},
	],
};

export class ChannelResource extends BaseResource {
	static async create(
		executeFunctions: IExecuteFunctions,
		index: number
	): Promise<IDataObject> {
		const body = {
			applicationId: executeFunctions.getNodeParameter(
				'applicationId',
				index
			) as string,
			name: executeFunctions.getNodeParameter('channelName', index) as string,
			type: executeFunctions.getNodeParameter('channelType', index) as string,
			config: executeFunctions.getNodeParameter('config', index) as object,
		};

		return await this.makeRequest(
			executeFunctions,
			'POST',
			'/channels',
			body,
			index
		);
	}

	static async list(
		executeFunctions: IExecuteFunctions,
		index: number
	): Promise<IDataObject[]> {
		const applicationId = executeFunctions.getNodeParameter(
			'applicationId',
			index
		) as string;
		const response = await this.makeRequest(
			executeFunctions,
			'GET',
			`/applications/${applicationId}/channels`,
			{},
			index
		);

		return response.channels as IDataObject[] || [];
	}
}
