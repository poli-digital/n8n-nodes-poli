import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { BaseResource } from '../resources/base';

export async function createApp(this: IExecuteFunctions, i: number): Promise<IDataObject> {
  const body = {
    accountId: this.getNodeParameter('accountId', i) as string,
    name: this.getNodeParameter('appName', i) as string,
    description: this.getNodeParameter('description', i) as string,
    responsible: this.getNodeParameter('responsible', i) as string,
    phone: this.getNodeParameter('phone', i) as string,
    email: this.getNodeParameter('email', i) as string,
    pictureFileId: this.getNodeParameter('pictureFileId', i) as string,
    visibility: this.getNodeParameter('visibility', i) as string,
  };

  return await BaseResource.makeRequest(this, 'POST', '/apps', body, i);
}

export async function listApps(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
  const accountId = this.getNodeParameter('accountId', i) as string;

  const response = await BaseResource.makeRequest(this, 'GET', `/accounts/${accountId}/apps`, {}, i);

  return response.apps as IDataObject[] || [];
}
