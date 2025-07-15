import { IResourceDescription } from '../interfaces/common';

export const contactDescription: IResourceDescription = {
  displayName: 'Contact',
  name: 'contact',
  value: 'contact',
  operations: [
    {
      displayName: 'List Contacts',
      name: 'operation',
      value: 'listContacts',
      properties: [],
    },
  ],
  properties: [
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      displayOptions: { show: { resource: ['contact'] } },
      options: [{ name: 'List Contacts', value: 'listContacts' }],
      default: 'listContacts',
    },
    {
      displayName: 'Account ID',
      name: 'accountId',
      type: 'string',
      default: '',
      required: true,
      displayOptions: {
        show: {
          resource: ['contact'],
          operation: ['listContacts'],
        },
      },
    },
    {
      displayName: 'Include',
      name: 'contactInclude',
      type: 'multiOptions',
      options: [
        { name: 'Attributes', value: 'attributes' },
        { name: 'Metadata', value: 'metadata' },
        { name: 'Organization', value: 'organization' },
        { name: 'Addresses', value: 'addresses' },
      ],
      default: ['attributes'],
      displayOptions: {
        show: {
          resource: ['contact'],
          operation: ['listContacts'],
        },
      },
    },
  ],
};
