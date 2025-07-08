import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Poli implements INodeType {
	// O objeto 'description' agora contém apenas informações da interface.
	description: INodeTypeDescription = {
		displayName: 'Poli',
		name: 'poli',
		icon: 'file:poli.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Nó para interagir com a API da Poli',
		defaults: {
			name: 'Poli',
		},
	};

	// AS PROPRIEDADES DECLARATIVAS FORAM MOVIDAS PARA CÁ,
	// para fora do 'description', como membros da classe.

	credentials = [
		{
			name: 'poliApi',
			required: true,
		},
	];

	requestDefaults = {
		baseURL: 'https://omniapi.poli.digital/v3',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	};

	resources = {
		account: {
			name: 'Account',
			operations: [
				{
					name: 'List',
					value: 'list',
					action: 'List accounts',
					description: 'List all accounts',
					routing: {
						request: {
							method: 'GET',
							url: '/accounts',
						},
					},
				},
			],
		},
		contact: {
			name: 'Contact',
			operations: [
				{
					name: 'List',
					value: 'list',
					action: 'List contacts',
					description: 'List all contacts for an account',
					properties: [
						{
							displayName: 'Account ID',
							name: 'accountId',
							type: 'string',
							default: '',
							required: true,
							description: 'O ID da Conta (Account) para listar os contatos',
						},
					],
					routing: {
						request: {
							method: 'GET',
							url: '=/accounts/{{$parameter.accountId}}/contacts',
						},
					},
				},
			],
		},
	};
}