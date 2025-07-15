import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export interface IOperationHandler {
  execute(
    this: IExecuteFunctions,
    index: number,
  ): Promise<INodeExecutionData>;
}

export interface IResourceDescription {
  displayName: string;
  name: string;
  value: string;
  operations: IOperationDescription[];
  properties: any[];
}

export interface IOperationDescription {
  displayName: string;
  name: string;
  value: string;
  properties: any[];
}
