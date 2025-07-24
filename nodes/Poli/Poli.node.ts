import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class Poli implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Poli',
    name: 'poli',
    icon: 'file:poli.svg',
    group: ['output'],
    version: 1,
    description: 'Unified Poli Node',
    defaults: {
      name: 'Poli',
    },
    inputs: ['main'],
    outputs: ['main'],
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
          { name: 'App', value: 'app' },
          { name: 'Channel', value: 'channel' },
          { name: 'Contact', value: 'contact' },
          { name: 'Template', value: 'template' },
        ],
        default: 'app',
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        required: true,
      },

      // OPTIONS - APP
      {
        displayName: 'Options (App)',
        name: 'options',
        type: 'collection',
        default: {},
        displayOptions: {
          show: {
            resource: ['app'],
          },
        },
        options: [
          {
            displayName: 'Include',
            name: 'include',
            type: 'multiOptions',
            options: [
              { name: 'Status', value: 'status' },
              { name: 'Visibility', value: 'visibility' },
              { name: 'Attributes', value: 'attributes' },
              { name: 'Roles', value: 'roles' },
              { name: 'Permissions', value: 'permissions' },
              { name: 'Attachments', value: 'attachments' },
              { name: 'Resources', value: 'resources' },
              { name: 'Settings', value: 'settings' },
              { name: 'Accounts', value: 'accounts' },
              { name: 'Metadata', value: 'metadata' },
            ],
            default: [],
          },
        ],
      },

      // OPTIONS - CHANNEL
      {
        displayName: 'Options (Channel)',
        name: 'options',
        type: 'collection',
        default: {},
        displayOptions: {
          show: {
            resource: ['channel'],
          },
        },
        options: [
          {
            displayName: 'Include',
            name: 'include',
            type: 'multiOptions',
            options: [
              { name: 'UID', value: 'uid' },
              { name: 'Name', value: 'name' },
              { name: 'Status', value: 'status' },
              { name: 'Provider', value: 'provider' },
              { name: 'Integrator', value: 'integrator' },
              { name: 'Config', value: 'config' },
              { name: 'Metadata', value: 'metadata' },
            ],
            default: [],
          },
        ],
      },

      // OPTIONS - CONTACT
      {
        displayName: 'Options (Contact)',
        name: 'options',
        type: 'collection',
        default: {},
        displayOptions: {
          show: {
            resource: ['contact'],
          },
        },
        options: [
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
          },
        ],
      },

      // OPTIONS - TEMPLATE
      {
        displayName: 'Options (Template)',
        name: 'options',
        type: 'collection',
        default: {},
        displayOptions: {
          show: {
            resource: ['template'],
          },
        },
        options: [
          {
            displayName: 'Include',
            name: 'include',
            type: 'multiOptions',
            options: [
              { name: 'Key', value: 'key' },
              { name: 'Version', value: 'version' },
              { name: 'Status', value: 'status' },
              { name: 'Message', value: 'message' },
              { name: 'Team', value: 'team' },
              { name: 'Metadata', value: 'metadata' },
            ],
            default: [],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const accountId = this.getNodeParameter('accountId', i) as string;
        const options = this.getNodeParameter('options', i, {}) as {
          include?: string[];
        };

        const params = new URLSearchParams();

        if (options.include?.length) {
          params.append('include', options.include.join(','));
        }

        const endpoint = `/accounts/${accountId}/${resource}s?${params.toString()}`;
        const responseData = await apiRequest.call(this, 'GET', endpoint);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error);
      }
    }

    return [returnData];
  }
}
