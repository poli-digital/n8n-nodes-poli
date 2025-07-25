# 🚀 Sequência Completa de Limpeza e Atualização - n8n-nodes-poli

## ✅ Status Atual
- **15 nós** corrigidos e funcionais
- **Todos os nós** implementam `INodeType` corretamente
- **Package.json** atualizado com todos os nós
- **Index.ts** exportando todos os nós
- **Build** realizado com sucesso

## 🧹 Scripts Criados

### 1. `clean-and-update.sh` - Limpeza Completa
```bash
./clean-and-update.sh
```
**O que faz:**
- Para todas as instâncias do n8n
- Remove builds antigos (dist/, node_modules/, caches)
- Limpa cache do npm
- Reinstala dependências
- Recompila projeto
- Verifica se todos os nós foram compilados
- Cria novo pacote .tgz

### 2. `install-and-run.sh` - Instalação e Execução
```bash
./install-and-run.sh
```
**O que faz:**
- Para instâncias do n8n em execução
- Instala o pacote globalmente no n8n
- Define variáveis de ambiente para webhooks
- Inicia o n8n com todos os 15 nós disponíveis

## 📋 Sequência Manual (se preferir)

### 1. Limpeza Total
```bash
# Parar n8n
pkill -f "n8n"

# Limpar builds e caches
rm -rf dist/ node_modules/.cache/ tsconfig.tsbuildinfo *.tgz
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules/
npm install
```

### 2. Build e Verificação
```bash
# Compilar projeto
npm run build

# Verificar nós compilados
ls dist/nodes/Poli/*.js | wc -l  # Deve retornar 16

# Verificar exportações
node -p "Object.keys(require('./dist/index.js')).length"  # Deve retornar 15
```

### 3. Limpeza do Cache do n8n
```bash
# Remover cache global do n8n
rm -rf ~/.n8n/.cache/ ~/.n8n/temp/ ~/.n8n/nodes/
```

### 4. Empacotar e Instalar
```bash
# Criar pacote
npm pack

# Instalar no n8n
npm install -g ./n8n-nodes-poli-0.1.0.tgz

# Executar n8n
export WEBHOOK_URL="http://localhost:5678"
export N8N_ENDPOINT_WEBHOOK_TEST="webhook-test"
npx n8n start
```

## 🎯 Nós Disponíveis (15 total)

1. **Poli Trigger** - Webhook trigger
2. **Add Tag To Contact** - Adicionar tag a contato  
3. **Create App** - Criar aplicação
4. **Create Tag** - Criar tag
5. **Create Webhook** - Criar webhook
6. **Forward Contact** - Encaminhar contato
7. **List Apps** - Listar aplicações
8. **List Channels** - Listar canais
9. **List Contacts** - Listar contatos
10. **List Tags** - Listar tags
11. **List Templates** - Listar templates
12. **List Webhooks** - Listar webhooks
13. **Send Message By Contact ID** - Enviar mensagem por ID do contato
14. **Send Message By Phone Number** - Enviar mensagem por telefone
15. **Send Template By Contact ID** - Enviar template por ID do contato

## 🔧 Problemas Resolvidos

✅ **Interface INodeType**: Todos os nós agora implementam corretamente  
✅ **Tipo de Descrição**: Mudado de `description =` para `description: INodeTypeDescription =`  
✅ **Ícone**: Adicionado `icon: 'file:poli.svg'` em todos os nós  
✅ **Credenciais**: Adicionado seção `credentials` onde necessário  
✅ **Exportações**: Todos os 15 nós exportados no index.ts  
✅ **Registro**: Todos os 15 nós registrados no package.json  

## 🌐 Acesso

Após executar, o n8n estará disponível em:
**http://localhost:5678**

Todos os nós da Poli estarão visíveis na lista de nós disponíveis! 🎉
