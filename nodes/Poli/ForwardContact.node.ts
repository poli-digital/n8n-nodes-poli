import { IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class ForwardContact {
  description = {
    displayName: 'Forward Contact',
    name: 'forwardContact',
    group: ['output'],
    version: 1,
    description: 'Forward a contact to a user or team',
    defaults: {
      name: 'Forward Contact',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Contact UUID',
        name: 'contactUuid',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'User UUID',
        name: 'userUuid',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Team UUID',
        name: 'teamUuid',
        type: 'string',
        default: '',
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const contactUuid = this.getNodeParameter('contactUuid', i);
        const userUuid = this.getNodeParameter('userUuid', i) as string;
        const teamUuid = this.getNodeParameter('teamUuid', i, null) as string | null;

        const body: { user_uuid: string; team_uuid?: string | null } = {
          user_uuid: userUuid,
        };

        if (teamUuid) {
          body.team_uuid = teamUuid;
        }

        const endpoint = `/contacts/${contactUuid}/forward`;
        const responseData = await apiRequest.call(this, 'POST', endpoint, body);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}