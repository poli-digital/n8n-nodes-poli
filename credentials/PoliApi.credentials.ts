import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PoliApi implements ICredentialType {
	name = 'poliApi';
	displayName = 'Poli API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'Insira seu Bearer Token aqui',
			description: 'Sua chave de API para a Poli (Bearer Token)',
			required: true,
		},
	];
}
