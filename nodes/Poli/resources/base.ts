import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { apiRequest } from '../transport';

export class BaseResource {
  static async makeRequest(
    executeFunctions: IExecuteFunctions,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: IDataObject,
    index: number = 0,
  ): Promise<IDataObject> {
    return await apiRequest.call(executeFunctions, method, endpoint, body);
  }
}
