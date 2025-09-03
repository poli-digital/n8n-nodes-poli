import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { BaseResource } from '../resources/base';
import { getParameterSafe } from '../utils/parameterUtils';

export async function createWebhook(this: IExecuteFunctions, i: number): Promise<IDataObject> {
  const body = {
    applicationId: getParameterSafe(this, 'applicationId', i, '', true),
    url: getParameterSafe(this, 'url', i, '', true),
    subscriptions: getParameterSafe(this, 'subscriptions', i, [], true),
  };

  return await BaseResource.makeRequest(this, 'POST', '/webhooks', body, i);
}

export async function listWebhooks(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
  const applicationId = getParameterSafe(this, 'applicationId', i, '', true);

  const response = await BaseResource.makeRequest(
    this,
    'GET',
    `/applications/${applicationId}/webhooks`,
    {},
    i,
  );

  return response.webhooks as IDataObject[] || [];
}
