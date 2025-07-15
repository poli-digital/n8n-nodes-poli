import { INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { channelDescription } from '../resources/channel';
import { contactDescription } from '../resources/contact';
import { messageDescription } from '../resources/message';
import { templateDescription } from '../resources/template';
import { appDescription } from '../resources/app';
import { webhookDescription } from '../resources/webhook';

export const nodeDescription: INodeTypeDescription = {
  displayName: 'Poli',
  name: 'poli',
  icon: 'file:poli.svg',
  group: ['output'],
  version: 1,
  description: 'Nó para interagir com a API da Poli',
  defaults: {
    name: 'Poli',
  },
  inputs: [NodeConnectionType.Main],
  outputs: [NodeConnectionType.Main],
  credentials: [
    {
      name: 'poliApi',
      required: true,
    },
  ],
  properties: [
    {
      displayName: 'Resource',
      name: 'resource',
      type: 'options',
      options: [
        channelDescription,
        contactDescription,
        messageDescription,
        templateDescription,
        appDescription,
        webhookDescription,
      ].map(({ displayName, name, value }) => ({
        name: displayName,
        value,
      })),
      default: 'channel',
    },
    ...channelDescription.properties,
    ...contactDescription.properties,
    ...messageDescription.properties,
    ...templateDescription.properties,
    ...appDescription.properties,
    ...webhookDescription.properties,
  ],
};
