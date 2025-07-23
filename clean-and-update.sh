#!/bin/bash

echo "🧹 Script Completo de Limpeza e Atualização"
echo "=========================================="

# Definir cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}1️⃣ Parando n8n e limpando processos...${NC}"
pkill -f "n8n" 2>/dev/null || echo "Nenhuma instância do n8n rodando"
sleep 2

echo -e "${BLUE}2️⃣ Removendo builds e caches antigos...${NC}"
rm -rf dist/
rm -rf node_modules/.cache/
rm -f tsconfig.tsbuildinfo
rm -f n8n-nodes-poli-*.tgz

echo -e "${BLUE}3️⃣ Limpando cache do npm...${NC}"
npm cache clean --force

echo -e "${BLUE}4️⃣ Removendo e reinstalando dependências...${NC}"
rm -rf node_modules/
npm install

echo -e "${BLUE}5️⃣ Compilando projeto...${NC}"
npm run build

echo -e "${BLUE}6️⃣ Verificando se todos os nós foram compilados...${NC}"
NODE_COUNT=$(ls dist/nodes/Poli/*.js | wc -l)
echo -e "${GREEN}✅ $NODE_COUNT arquivos compilados${NC}"

echo -e "${BLUE}7️⃣ Testando exportações...${NC}"
EXPORTED_NODES=$(node -p "Object.keys(require('./dist/index.js')).length")
echo -e "${GREEN}✅ $EXPORTED_NODES nós exportados${NC}"

echo -e "${BLUE}8️⃣ Limpando cache global do n8n...${NC}"
rm -rf ~/.n8n/.cache/ ~/.n8n/temp/ ~/.n8n/nodes/ 2>/dev/null || echo "Cache limpo"

echo -e "${BLUE}9️⃣ Criando novo pacote...${NC}"
npm pack

echo -e "${GREEN}✅ Limpeza e atualização concluída!${NC}"
echo ""
echo -e "${YELLOW}Para instalar e executar o n8n:${NC}"
echo -e "${BLUE}./install-and-run.sh${NC}"
echo ""
echo -e "${YELLOW}Ou manualmente:${NC}"
echo -e "${BLUE}npm install -g ./n8n-nodes-poli-0.1.0.tgz${NC}"
echo -e "${BLUE}npx n8n start${NC}"
