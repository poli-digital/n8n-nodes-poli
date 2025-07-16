import type {
    IExecuteFunctions,
    INodeType,
    INodeTypeDescription,
    IWebhookFunctions,
    IWebhookResponseData,
    IDataObject,
    INodeExecutionData,
    JsonObject,
} from 'n8n-workflow';

import { apiRequest } from './transport';
import { NodeApiError } from 'n8n-workflow';

interface IWebhookStorage {
    webhookUrl: string;
    applicationId: string;
    events: string[];
}

export class PoliTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Poli Trigger',
        name: 'poliTrigger',
        icon: 'file:poli.svg',
        group: ['trigger'],
        version: 1,
        description: 'Trigger para receber webhooks da API da Poli',
        defaults: {
            name: 'Poli Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'poliApi',
                required: true,
            },
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'onReceived',
                path: 'poli',
            },
        ],
        properties: [
            {
                displayName: 'App Name',
                name: 'appName',
                type: 'string',
                default: '',
                required: true,
                description: 'Nome do app que será criado na Poli',
            },
            {
                displayName: 'Eventos',
                name: 'events',
                type: 'multiOptions',
                options: [
                    {
                        name: 'Message Received',
                        value: 'message.received',
                        description: 'Quando uma nova mensagem é recebida'
                    },
                    {
                        name: 'Message Status Updated',
                        value: 'message.status',
                        description: 'Quando o status de uma mensagem é atualizado'
                    },
                    {
                        name: 'Contact Updated',
                        value: 'contact.updated',
                        description: 'Quando um contato é atualizado'
                    },
                    {
                        name: 'Contact Created',
                        value: 'contact.created',
                        description: 'Quando um novo contato é criado'
                    }
                ],
                default: ['message.received'],
                required: true,
                description: 'Eventos que serão monitorados',
            },
        ],
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const bodyData = this.getBodyData() as IDataObject;

        return {
            workflowData: [
                this.helpers.returnJsonArray([bodyData])
            ],
        };
    }

    async activate(this: IWebhookFunctions): Promise<void> {
        const credentials = await this.getCredentials('poliApi');
        const webhookUrl = this.getNodeWebhookUrl('default');

        const accountUuid = credentials.accountUuid as string;
        const events = this.getNodeParameter('events', 0) as string[];
        const appName = this.getNodeParameter('appName', 0) as string;

        try {
            const appData = {
                visibility: 'PRIVATE',
                attributes: {
                    name: appName,
                    description: 'App criado automaticamente pelo n8n para receber webhooks',
                    responsible: 'n8n',
                    email: 'n8n@poli.digital',
                    phone: '0000000000'
                }
            };

            const appResponse = await apiRequest.call(
                this as unknown as IExecuteFunctions,
                'POST',
                `/accounts/${accountUuid}/applications?include=attributes`,
                appData
            );

            if (!appResponse.data || !appResponse.data.id) {
                throw new Error('Erro ao criar app na Poli');
            }

            const applicationId = appResponse.data.id;

            const webhookData = {
                url: webhookUrl,
                subscriptions: events
            };

            await apiRequest.call(
                this as unknown as IExecuteFunctions,
                'POST',
                `/applications/${applicationId}/webhooks?include=url,subscriptions`,
                webhookData
            );

        } catch (error) {
            throw new NodeApiError(this.getNode(), error as unknown as JsonObject);
        }
    }
}