import { IExecuteFunctions } from 'n8n-workflow';

/**
 * Obtém um parâmetro do nó de forma segura, com fallback em caso de erro
 * @param executeFunctions - Contexto de execução do n8n
 * @param parameterName - Nome do parâmetro
 * @param itemIndex - Índice do item
 * @param fallback - Valor padrão caso o parâmetro não seja encontrado
 * @param required - Se true, lança erro caso o parâmetro esteja ausente ou vazio
 * @returns Valor do parâmetro ou fallback
 */
export function getParameterSafe(
	executeFunctions: IExecuteFunctions,
	parameterName: string,
	itemIndex: number,
	fallback: any = '',
	required: boolean = false
): any {
	try {
		const value = executeFunctions.getNodeParameter(parameterName, itemIndex, fallback);
		
		// Se é obrigatório e está vazio/null/undefined, lança erro
		if (required && (value === '' || value === null || value === undefined)) {
			throw new Error(`❌ Parâmetro obrigatório '${parameterName}' está vazio ou ausente`);
		}
		
		return value;
	} catch (error: any) {
		if (required) {
			throw new Error(`❌ Parâmetro obrigatório '${parameterName}' não encontrado: ${error.message}`);
		}
		
		console.warn(`⚠️ Parâmetro '${parameterName}' não encontrado no item ${itemIndex}, usando fallback:`, fallback);
		return fallback;
	}
}

/**
 * Valida se um parâmetro obrigatório tem valor
 * @param value - Valor a ser validado
 * @param parameterName - Nome do parâmetro para mensagem de erro
 */
export function validateRequiredParameter(value: any, parameterName: string): void {
	if (value === '' || value === null || value === undefined) {
		throw new Error(`❌ Parâmetro obrigatório '${parameterName}' é necessário`);
	}
}

/**
 * Obtém múltiplos parâmetros de forma segura
 * @param executeFunctions - Contexto de execução do n8n
 * @param itemIndex - Índice do item
 * @param parameters - Array de configurações de parâmetros
 * @returns Objeto com todos os parâmetros obtidos
 */
export function getMultipleParametersSafe(
	executeFunctions: IExecuteFunctions,
	itemIndex: number,
	parameters: Array<{
		name: string;
		fallback?: any;
		required?: boolean;
	}>
): Record<string, any> {
	const result: Record<string, any> = {};
	
	for (const param of parameters) {
		result[param.name] = getParameterSafe(
			executeFunctions,
			param.name,
			itemIndex,
			param.fallback || '',
			param.required || false
		);
	}
	
	return result;
}
