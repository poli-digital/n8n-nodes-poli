import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { IResourceDescription } from '../interfaces/common';
import { BaseResource } from './base';

export const appDescription: IResourceDescription = {
  displayName: 'App',
  name: 'app',
  value: 'app',
  operations: [
    {
      displayName: 'Create',
      name: 'operation',
      value: 'createApp',
      description: 'Create a new app',
      action: 'Create an app',
    },
    {
      displayName: 'List',
      name: 'operation',
      value: 'listApps',
      description: 'Get list of apps',
      action: 'Get list of apps',
    },
  ],
  properties: [
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      displayOptions: { show: { resource: ['app'] } },
      options: [
        {
          name: 'Create',
          value: 'createApp',
        },
        {
          name: 'List',
          value: 'listApps',
        },
      ],
      default: 'createApp',
    },
  ],
};

export class AppResource extends BaseResource {
  static async create(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject> {
    const body = {
      accountId: executeFunctions.getNodeParameter('accountId', index) as string,
      name: executeFunctions.getNodeParameter('appName', index) as string,
      description: executeFunctions.getNodeParameter('description', index) as string,
      responsible: executeFunctions.getNodeParameter('responsible', index) as string,
      phone: executeFunctions.getNodeParameter('phone', index) as string,
      email: executeFunctions.getNodeParameter('email', index) as string,
      pictureFileId: executeFunctions.getNodeParameter('pictureFileId', index) as string,
      visibility: executeFunctions.getNodeParameter('visibility', index) as string,
    };

    return await this.makeRequest(executeFunctions, 'POST', '/apps', body, index);
  }

  static async list(executeFunctions: IExecuteFunctions, index: number): Promise<IDataObject[]> {
    const accountId = executeFunctions.getNodeParameter('accountId', index) as string;

    const response = await this.makeRequest(
      executeFunctions,
      'GET',
      `/accounts/${accountId}/apps`,
      {},
      index,
    );

    return response.apps as IDataObject[] || [];
  }
}
