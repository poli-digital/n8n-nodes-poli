import type { IExecuteFunctions, IDataObject, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface PoliApiError {
	message: string;
	code?: string;
	statusCode?: number;
	details?: any;
}

/**
 * Função para fazer requisições à API da Poli com tratamento robusto de erros e retry logic
 */
export async function apiRequest(
	this: IExecuteFunctions,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	maxRetries: number = 3,
): Promise<any> {
	const credentials = await this.getCredentials('poliApi');
	const baseUrl = 'https://foundation-api.poli.digital/v3';
	
	// Garantir que endpoint comece com "/"
	const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	
	const options = {
		method,
		url: `${baseUrl}${normalizedEndpoint}`,
		headers: {
			Authorization: `Bearer ${credentials.apiKey}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: method !== 'GET' ? body : undefined,
		qs,
		json: true,
		timeout: 30000, // 30 segundos de timeout
	};

	let lastError: any;
	
	// Implementar retry logic para falhas temporárias
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			console.log(`🔄 API Request [Tentativa ${attempt}/${maxRetries}]:`, {
				method,
				endpoint: normalizedEndpoint,
				hasBody: Object.keys(body).length > 0,
				hasQuery: Object.keys(qs).length > 0
			});

			// @ts-ignore
			const response = await this.helpers.request(options);
			
			console.log(`✅ API Request bem-sucedida:`, {
				method,
				endpoint: normalizedEndpoint,
				statusCode: 'success'
			});
			
			return response;
			
		} catch (error: any) {
			lastError = error;
			const statusCode = error.statusCode || error.response?.status || 0;
			
			console.error(`❌ API Request falhou [Tentativa ${attempt}/${maxRetries}]:`, {
				method,
				endpoint: normalizedEndpoint,
				statusCode,
				message: error.message,
				attempt,
				maxRetries
			});

			// Não fazer retry para erros que não são temporários
			if (shouldNotRetry(statusCode)) {
				console.warn(`🚫 Erro não temporário detectado (${statusCode}), interrompendo tentativas`);
				break;
			}

			// Se não é a última tentativa, aguardar antes de tentar novamente
			if (attempt < maxRetries) {
				const delayMs = calculateRetryDelay(attempt);
				console.log(`⏳ Aguardando ${delayMs}ms antes da próxima tentativa...`);
				await new Promise(resolve => setTimeout(resolve, delayMs));
			}
		}
	}

	// Se chegou aqui, todas as tentativas falharam
	throw createDetailedError(lastError, method, normalizedEndpoint);
}

/**
 * Determina se um erro não deve ser reprocessado
 */
function shouldNotRetry(statusCode: number): boolean {
	// Não fazer retry para:
	// - 4xx (erros do cliente) exceto 429 (rate limit)
	// - 401, 403 (problemas de autenticação/autorização)
	// - 404 (não encontrado)
	// - 422 (dados inválidos)
	const noRetryStatuses = [400, 401, 403, 404, 422];
	return noRetryStatuses.includes(statusCode);
}

/**
 * Calcula o delay para retry com backoff exponencial
 */
function calculateRetryDelay(attempt: number): number {
	// Backoff exponencial: 1s, 2s, 4s...
	const baseDelay = 1000;
	return baseDelay * Math.pow(2, attempt - 1);
}

/**
 * Cria um erro detalhado para o usuário
 */
function createDetailedError(error: any, method: string, endpoint: string): NodeApiError {
	const statusCode = error.statusCode || error.response?.status || 0;
	const errorMessage = error.message || 'Erro desconhecido';
	const errorDetails = error.response?.data || error.body || {};

	let userMessage = '';
	let description = '';

	// Mensagens específicas baseadas no status code
	switch (statusCode) {
		case 401:
			userMessage = 'Erro de autenticação: Token API inválido ou expirado';
			description = 'Verifique se o token da API Poli está correto nas credenciais';
			break;
		case 403:
			userMessage = 'Acesso negado: Sem permissão para esta operação';
			description = 'Verifique se sua conta tem as permissões necessárias';
			break;
		case 404:
			userMessage = 'Recurso não encontrado';
			description = `O endpoint ${method} ${endpoint} não foi encontrado ou o recurso não existe`;
			break;
		case 422:
			userMessage = 'Dados inválidos enviados para a API';
			description = 'Verifique se todos os parâmetros obrigatórios estão preenchidos corretamente';
			break;
		case 429:
			userMessage = 'Limite de requisições excedido';
			description = 'Aguarde alguns momentos antes de tentar novamente';
			break;
		case 500:
		case 502:
		case 503:
		case 504:
			userMessage = 'Erro interno do servidor da API Poli';
			description = 'Problema temporário no servidor. Tente novamente em alguns minutos';
			break;
		default:
			userMessage = `Falha na comunicação com a API Poli (${statusCode})`;
			description = errorMessage;
	}

	const nodeError = {
		message: userMessage,
		description: description,
		httpCode: statusCode,
		cause: {
			endpoint,
			method,
			statusCode,
			originalMessage: errorMessage,
			details: errorDetails
		}
	};

	// @ts-ignore
	return new NodeApiError({ type: 'n8n-nodes-poli' }, nodeError as JsonObject);
}
