#!/bin/bash

echo "🚀 Script de Instalação e Execução Completa do n8n-nodes-poli"
echo "=============================================================="

# Definir cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔟 Instalando pacote no n8n...${NC}"

# Parar qualquer instância do n8n que esteja rodando
echo -e "${YELLOW}Parando instâncias do n8n...${NC}"
pkill -f "n8n" 2>/dev/null || echo "Nenhuma instância do n8n rodando"

# Aguardar um pouco para garantir que parou
sleep 2

# Instalar o pacote no n8n
echo -e "${YELLOW}Instalando pacote atualizado...${NC}"
npm install -g ./n8n-nodes-poli-0.1.0.tgz

echo -e "${GREEN}✅ Pacote instalado com sucesso!${NC}"

echo ""
echo -e "${BLUE}🎯 Iniciando n8n com todos os 15 nós...${NC}"
echo -e "${YELLOW}Aguarde o n8n carregar completamente...${NC}"
echo ""

# Definir variáveis de ambiente para webhook
export WEBHOOK_URL="http://localhost:5678"
export N8N_ENDPOINT_WEBHOOK_TEST="webhook-test"

echo -e "${GREEN}Nós disponíveis no n8n:${NC}"
echo "✅ Poli Trigger"
echo "✅ Add Tag To Contact" 
echo "✅ Create App"
echo "✅ Create Tag"
echo "✅ Create Webhook"
echo "✅ Forward Contact"
echo "✅ List Apps"
echo "✅ List Channels"
echo "✅ List Contacts"
echo "✅ List Tags"
echo "✅ List Templates"
echo "✅ List Webhooks"
echo "✅ Send Message By Contact ID"
echo "✅ Send Message By Phone Number"
echo "✅ Send Template By Contact ID"
echo ""
echo -e "${BLUE}🌐 n8n será aberto em: http://localhost:5678${NC}"
echo -e "${YELLOW}Para parar o n8n: Ctrl+C${NC}"
echo ""

# Iniciar n8n
npx n8n start
