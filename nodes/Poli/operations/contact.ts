import { IExecuteFunctions } from 'n8n-workflow';

import { apiRequest } from '../transport';

export async function addTagToContact(this: IExecuteFunctions, contactUuid: string, tagUuid: string): Promise<void> {
    const endpoint = `/contacts/${contactUuid}?include=attributes,tags`;
    const body = {
        tags: [
            {
                uuid: tagUuid,
            },
        ],
    };

    await apiRequest.call(this, 'POST', endpoint, body);
}