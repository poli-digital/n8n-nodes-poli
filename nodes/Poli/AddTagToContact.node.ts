import { IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class AddTagToContact {
  description = {
    displayName: 'AddTagToContact', // Nome visível no menu lateral
    name: 'addTagToContact',        // Identificador interno (não precisa mudar)
    group: ['output'],
    version: 1,
    description: 'Add a tag to a contact',
    defaults: {
      name: 'AddTagToContact',      // Nome padrão no canvas
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Contact UUID',
        name: 'contactUuid',
        type: 'string',
        required: true,
        default: '',
        description: 'UUID of the contact to which the tag will be added',
      },
      {
        displayName: 'Tag UUID',
        name: 'tagUuid',
        type: 'string',
        required: true,
        default: '',
        description: 'UUID of the tag to be added to the contact',
      },
    ],
    codex: {
      categories: ['Poli'], // Agrupamento no menu (opcional)
    },
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const contactUuid = this.getNodeParameter('contactUuid', i);
        const tagUuid = this.getNodeParameter('tagUuid', i);

        const body = { tag_uuid: tagUuid };
        const endpoint = `/contacts/${contactUuid}/tags`;

        const responseData = await apiRequest.call(this, 'POST', endpoint, body);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}
