import { INodeTypeDescription } from 'n8n-workflow';
import { Poli } from './Poli.node';

export class PoliNode extends Poli {
	description: INodeTypeDescription = {
		...this.description,
		name: 'poli',
		icon: 'file:poli.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Poli API',
		defaults: {
			name: 'Poli',
		},
		credentials: [
			{
				name: 'poliApi',
				required: true,
			},
		],
	};
}
