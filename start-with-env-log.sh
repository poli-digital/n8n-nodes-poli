#!/bin/bash
set -a
source .env
set +a

echo "🔧 [INFO] Variáveis de ambiente carregadas:"
echo "WEBHOOK_URL: $WEBHOOK_URL"
echo "N8N_ENDPOINT_WEBHOOK: $N8N_ENDPOINT_WEBHOOK"
echo "N8N_ENDPOINT_WEBHOOK_TEST: $N8N_ENDPOINT_WEBHOOK_TEST"
echo "N8N_HOST: $N8N_HOST"
echo "N8N_PORT: $N8N_PORT"
echo "-------------------------"
echo "Iniciando n8n..."
echo "-------------------------"

npx -y n8n start
