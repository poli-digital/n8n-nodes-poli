import { IExecuteFunctions, INodeExecutionData, INodeProperties, NodePropertyTypes } from 'n8n-workflow';

export interface IOperationHandler {
  execute(
    this: IExecuteFunctions,
    index: number,
  ): Promise<INodeExecutionData>;
}

export interface INodeResourceOperation {
  displayName: string;
  name: string;
  value: string;
  description?: string;
  action?: string;
  properties?: INodeProperties[];
}

export interface IResourceDescription {
  displayName: string;
  name: string;
  value: string;
  operations: INodeResourceOperation[];
  properties: Array<INodeProperties & { type: NodePropertyTypes }>;
}
