import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { BaseResource } from '../resources/base';
import { getParameterSafe } from '../utils/parameterUtils';

export async function createApp(this: IExecuteFunctions, i: number): Promise<IDataObject> {
  const body = {
    accountId: getParameterSafe(this, 'accountId', i, '', true),
    name: getParameterSafe(this, 'appName', i, '', true),
    description: getParameterSafe(this, 'description', i, ''),
    responsible: getParameterSafe(this, 'responsible', i, ''),
    phone: getParameterSafe(this, 'phone', i, ''),
    email: getParameterSafe(this, 'email', i, ''),
    pictureFileId: getParameterSafe(this, 'pictureFileId', i, ''),
    visibility: getParameterSafe(this, 'visibility', i, 'PRIVATE'),
  };

  return await BaseResource.makeRequest(this, 'POST', '/apps', body, i);
}

export async function listApps(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
  const accountId = getParameterSafe(this, 'accountId', i, '', true);

  const response = await BaseResource.makeRequest(this, 'GET', `/accounts/${accountId}/apps`, {}, i);

  return response.apps as IDataObject[] || [];
}
