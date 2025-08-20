import { IExecuteFunctions, INodeType, INodeTypeDescription, JsonObject, NodeApiError } from 'n8n-workflow';
import { apiRequest } from './transport';

export class CreateContact implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Create Contact',
    name: 'createContact',
    icon: 'file:poli.svg',
    group: ['output'],
    version: 1,
    description: 'Create a new contact in Poli',
    defaults: {
      name: 'Create Contact',
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
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'Phone (com DDD)',
        name: 'phone',
        type: 'string',
        default: '',
        required: true,
      },
      {
        displayName: 'E-mail',
        name: 'email',
        type: 'string',
        default: '',
      },
      {
        displayName: 'CPF/CNPJ',
        name: 'doc',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Picture File ID',
        name: 'pictureFileId',
        type: 'string',
        default: '',
        description: 'Opcional. file_id de um arquivo já enviado para usar como foto',
      },
      {
        displayName: 'Tag ID',
        name: 'tagUuid',
        type: 'string',
        default: '',
        description: 'Opcional. Uma tag para associar ao contato',
      },
      {
        displayName: 'Phone (com DDD)',
        name: 'contactChannelUid',
        type: 'string',
        default: '',
        description: 'Opcional. UID do canal de WhatsApp para setar como DEFAULT',
      },
      {
        displayName: 'Contact Account ID',
        name: 'companyUuid',
        type: 'string',
        default: '',
        description:
          'Opcional. Empresa para relacionar com o contato. Enviada em companies[]. Troque para attributes.company_uuid se sua API exigir.',
      },
      {
        displayName: 'Addresses',
        name: 'addresses',
        type: 'fixedCollection',
        placeholder: 'Add Address',
        typeOptions: { multipleValues: true },
        default: {},
        options: [
          {
            name: 'address',
            displayName: 'Address',
            values: [
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                  { name: 'Headquarter', value: 'Headquarter' },
                  { name: 'Billing', value: 'Billing' },
                  { name: 'Shipping', value: 'Shipping' },
                  { name: 'Other', value: 'Other' },
                ],
                default: 'Headquarter',
              },
              { displayName: 'Country Code', name: 'country_code', type: 'string', default: 'BRA' },
              { displayName: 'Country', name: 'country', type: 'string', default: 'Brasil' },
              { displayName: 'Postal Code (CEP)', name: 'postal_code', type: 'string', default: '' },
              { displayName: 'State (UF)', name: 'state', type: 'string', default: '' },
              { displayName: 'City', name: 'city', type: 'string', default: '' },
              { displayName: 'Street', name: 'street', type: 'string', default: '' },
              { displayName: 'Number', name: 'number', type: 'string', default: '' },
              { displayName: 'Neighborhood', name: 'neighborhood', type: 'string', default: '' },
              { displayName: 'Complement', name: 'complement', type: 'string', default: '' },
            ],
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const accountId = this.getNodeParameter('accountId', i) as string;
        const name = this.getNodeParameter('name', i) as string;
        const phone = this.getNodeParameter('phone', i) as string;
        const email = this.getNodeParameter('email', i, '') as string;
        const doc = this.getNodeParameter('doc', i, '') as string;
        const pictureFileId = this.getNodeParameter('pictureFileId', i, '') as string;
        const tagUuid = this.getNodeParameter('tagUuid', i, '') as string;
        const contactChannelUid = this.getNodeParameter('contactChannelUid', i, '') as string;
        const companyUuid = this.getNodeParameter('companyUuid', i, '') as string;
        const addressesParam = (this.getNodeParameter('addresses', i, {}) as {
          address?: Array<Record<string, string>>;
        }) || { };

        const body: any = {
          type: 'PERSON',
          attributes: {
            name,
            phone,
          },
        };

        if (email) body.attributes.email = email;
        if (doc) body.attributes.doc = doc;
        if (pictureFileId) body.attributes.picture = { file_id: pictureFileId };

        if (tagUuid) {
          body.tags = [{ uuid: tagUuid }];
        }

        if (contactChannelUid) {
          body.contact_channels = [
            {
              uid: contactChannelUid,
              provider: 'WHATSAPP',
              type: 'DEFAULT',
            },
          ];
        }

        // Empresa (relacionamento)
        if (companyUuid) {
          body.companies = [{ uuid: companyUuid }];
          // Se sua API usar attributes.company_uuid, troque a linha acima por:
          // body.attributes.company_uuid = companyUuid;
        }

        // Endereços
        if (addressesParam?.address?.length) {
          body.addresses = addressesParam.address.map((a) => ({
            type: a.type || 'Headquarter',
            country_code: a.country_code || 'BRA',
            country: a.country || 'Brasil',
            postal_code: a.postal_code || '',
            state: a.state || '',
            city: a.city || '',
            street: a.street || '',
            number: a.number || '',
            neighborhood: a.neighborhood || '',
            complement: a.complement || '',
          }));
        }

        const endpoint = `/accounts/${accountId}/contacts?include=*`;

        let responseData;

        try {
          responseData = await apiRequest.call(this, 'POST', endpoint, body);
        } catch (error: any) {
          // Contato já existe / duplicado
          const status = error?.statusCode || error?.response?.statusCode;
          const message: string =
            error?.message ||
            error?.response?.body?.message ||
            error?.response?.body?.error ||
            '';

          if (
            status === 409 ||
            status === 422 ||
            /exists|duplicado|duplicate|already/i.test(message)
          ) {
            responseData = {
              message: 'Contato já existe',
              details: message || 'Registro duplicado',
              phone,
              email,
              doc,
            };
          } else {
            throw new NodeApiError(this.getNode(), error as JsonObject);
          }
        }

        returnData.push({ json: responseData });
      } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject);
      }
    }

    return [returnData];
  }
}
