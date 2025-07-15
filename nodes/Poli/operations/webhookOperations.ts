import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { BaseResource } from '../resources/base';

export async function createWebhook(this: IExecuteFunctions, i: number): Promise<IDataObject> {
  const body = {
    applicationId: this.getNodeParameter('applicationId', i) as string,
    url: this.getNodeParameter('url', i) as string,
    subscriptions: this.getNodeParameter('subscriptions', i) as string[],
  };

  return await BaseResource.makeRequest(this, 'POST', '/webhooks', body, i);
}

export async function listWebhooks(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
  const applicationId = this.getNodeParameter('applicationId', i) as string;

  const response = await BaseResource.makeRequest(
    this,
    'GET',
    `/applications/${applicationId}/webhooks`,
    {},
    i,
  );

  return response.webhooks as IDataObject[] || [];
}
