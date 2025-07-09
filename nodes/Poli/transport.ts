import type { IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function apiRequest(
	this: IExecuteFunctions,
	method: string,
	endpoint: string,
	body: any = {},
	query: any = {},
): Promise<any> {
	const credentials = await this.getCredentials('poliApi');

	const options: any = {
		method,
		url: `https://app.poli.digital/api/v1${endpoint}`,
		headers: {
			Authorization: `Bearer ${credentials.apiKey}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		json: true,
		qs: query,
	};

	// Para GET, não envia body
	if (method !== 'GET') {
		options.body = body;
	}

	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
