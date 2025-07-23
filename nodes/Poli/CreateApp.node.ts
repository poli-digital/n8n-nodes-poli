import { IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';
import { JsonObject } from 'n8n-workflow';

export class CreateApp {
  description = {
    displayName: 'Create App',
    name: 'createApp',
    group: ['output'],
    version: 1,
    description: 'Create a new application',
    defaults: {
      name: 'Create App',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Visibility',
        name: 'visibility',
        type: 'options',
        options: [
          { name: 'Public', value: 'public' },
          { name: 'Private', value: 'private' },
        ],
        default: 'public',
        required: true,
      },
      {
        displayName: 'App Name',
        name: 'appName',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Responsible',
        name: 'responsible',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Picture File ID',
        name: 'pictureFileId',
        type: 'string',
        default: '',
        required: false,
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const accountId = this.getNodeParameter('accountId', i);
        const visibility = this.getNodeParameter('visibility', i) as string;
        const appName = this.getNodeParameter('appName', i) as string;
        const description = this.getNodeParameter('description', i) as string;
        const responsible = this.getNodeParameter('responsible', i) as string;
        const phone = this.getNodeParameter('phone', i) as string;
        const email = this.getNodeParameter('email', i) as string;
        const pictureFileId = this.getNodeParameter('pictureFileId', i, '') as string;

        const body = {
          visibility: visibility.toUpperCase(),
          attributes: {
            name: appName,
            description,
            responsible,
            phone,
            email,
            picture: pictureFileId ? { file_id: pictureFileId } : undefined,
          },
          attachments: [],
          settings: [
            {
              type: 'link',
              name: 'webhook',
              placeholder: 'https://example.com/webhook',
            },
          ],
          resources: [],
        };

        const endpoint = `/accounts/${accountId}/applications?include=attributes`;
        const responseData = await apiRequest.call(this, 'POST', endpoint, body);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}