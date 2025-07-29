import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, JsonObject, NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class SendTemplateByContactId implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Send Template By Contact ID',
    name: 'sendTemplateByContactId',
    icon: 'file:poli.svg',
    group: ['output'],
    version: 1,
    description: 'Send a template message to a contact by ID',
    defaults: {
      name: 'Send Template By Contact ID',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'poliApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Account Channel ID',
        name: 'accountChannelUuid',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Template ID',
        name: 'templateUuid',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Header Parameters',
        name: 'headerParams',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Header Parameter',
        default: [],
        options: [
          {
            name: 'parameter',
            displayName: 'Parameter',
            values: [
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                  { name: 'Text', value: 'text' },
                  { name: 'Date/Time', value: 'date_time' },
                ],
                default: 'text',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Body Parameters',
        name: 'bodyParams',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        placeholder: 'Add Body Parameter',
        default: [],
        options: [
          {
            name: 'parameter',
            displayName: 'Parameter',
            values: [
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                  { name: 'Text', value: 'text' },
                  { name: 'Date/Time', value: 'date_time' },
                ],
                default: 'text',
              },
              {
                displayName: 'Value',
                name: 'value',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const contactId = this.getNodeParameter('contactId', i);
        const accountChannelUuid = this.getNodeParameter('accountChannelUuid', i);
        const templateUuid = this.getNodeParameter('templateUuid', i);
        const headerParams = this.getNodeParameter('headerParams.parameter', i, []) as any[];
        const bodyParams = this.getNodeParameter('bodyParams.parameter', i, []) as any[];

        const components: any = {};
        if (headerParams.length > 0) {
          components.header = {
            parameters: headerParams.map((param) => ({
              type: param.type,
              [param.type === 'text' ? 'text' : 'date_time']: param.value,
            })),
          };
        }
        if (bodyParams.length > 0) {
          components.body = {
            parameters: bodyParams.map((param) => ({
              type: param.type,
              [param.type === 'text' ? 'text' : 'date_time']: param.value,
            })),
          };
        }

        const body = {
          provider: 'WHATSAPP',
          account_channel_uuid: accountChannelUuid,
          template_uuid: templateUuid,
          type: 'TEMPLATE',
          version: 'v3',
          components,
        };

        const endpoint = `/contacts/${contactId}/messages`;
        const responseData = await apiRequest.call(this, 'POST', endpoint, body);
        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}
