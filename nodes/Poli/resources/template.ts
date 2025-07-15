import { IResourceDescription } from '../interfaces/common';

export const templateDescription: IResourceDescription = {
  displayName: 'Template',
  name: 'template',
  value: 'template',
  operations: [
    {
      displayName: 'List Templates',
      name: 'operation',
      value: 'listTemplates',
      properties: [],
    },
    {
      displayName: 'Send Template By Contact ID',
      name: 'operation',
      value: 'sendTemplateByContactId',
      properties: [],
    },
  ],
  properties: [
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      displayOptions: { show: { resource: ['template'] } },
      options: [
        { name: 'List Templates', value: 'listTemplates' },
        { name: 'Send Template By Contact ID', value: 'sendTemplateByContactId' },
      ],
      default: 'listTemplates',
    },
    {
      displayName: 'Account ID',
      name: 'accountIdTemplate',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: { resource: ['template'], operation: ['listTemplates'] },
      },
    },
    {
      displayName: 'Contact ID',
      name: 'contactId',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
      },
    },
    {
      displayName: 'Account Channel UUID',
      name: 'accountChannelUuid',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
      },
    },
    {
      displayName: 'Template UUID',
      name: 'templateUuid',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
      },
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
      displayOptions: {
        show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
      },
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
      displayOptions: {
        show: { resource: ['template'], operation: ['sendTemplateByContactId'] },
      },
    },
  ],
};
