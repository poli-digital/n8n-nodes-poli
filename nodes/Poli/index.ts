import type { INodeType } from 'n8n-workflow'; // Adicionar importação
import { INodeTypeDescription } from 'n8n-workflow';
import { Poli } from './Poli.node';
import { PoliTrigger } from './PoliTrigger.node';

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

export class PoliNodes {
	private constructor() {
		// Singleton
	}

	// Method used by n8n-node-module.js to get the nodes
	public static getNodes(): INodeType[] {
		return [
			new PoliTrigger(),
		];
	}
}

export const nodes = [
	PoliTrigger,
];
