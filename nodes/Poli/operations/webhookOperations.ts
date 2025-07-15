import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { apiRequest } from '../transport';
import { IOperationHandler } from '../interfaces/common';

export class WebhookOperations implements IOperationHandler {
  async execute(
    this: IExecuteFunctions,
    index: number,
  ): Promise<INodeExecutionData> {
    const applicationId = this.getNodeParameter('applicationId', index);
    const url = this.getNodeParameter('url', index);
    const subscriptions = this.getNodeParameter('subscriptions', index);

    const body = { url, subscriptions };
    const endpoint = `/applications/${applicationId}/webhooks?include=url,subscriptions`;
    const responseData = await apiRequest.call(this, 'POST', endpoint, body);

    return { json: responseData };
  }
}
