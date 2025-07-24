import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PoliApi implements ICredentialType {
  name = 'poliApi';
  displayName = 'Poli';
  icon = 'file:poli.svg';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      required: true,
      typeOptions: {
        password: true,
      },
      description: 'Bearer token da API Poli',
    },
  ];
}