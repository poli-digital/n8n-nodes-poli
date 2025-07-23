#!/bin/bash

echo "🧹 Script de Limpeza e Reinstalação do n8n-nodes-poli"
echo "===================================================="

# Parar qualquer processo n8n em execução
echo "🛑 Parando processos n8n..."
pkill -f n8n 2>/dev/null || echo "   Nenhum processo n8n encontrado"

# Limpar cache npm
echo "🗑️  Limpando cache npm..."
npm cache clean --force

# Desinstalar pacote anterior (caso exista)
echo "📦 Desinstalando pacote anterior..."
npm uninstall n8n-nodes-poli 2>/dev/null || echo "   Pacote não estava instalado"

# Remover diretórios de cache do n8n (se existirem)
echo "🧽 Limpando cache do n8n..."
rm -rf ~/.n8n/nodes 2>/dev/null || echo "   Cache de nodes não encontrado"
rm -rf ~/.n8n/.cache 2>/dev/null || echo "   Cache geral não encontrado"

# Verificar se o pacote existe
if [ ! -f "n8n-nodes-poli-0.1.0.tgz" ]; then
    echo "❌ Arquivo n8n-nodes-poli-0.1.0.tgz não encontrado!"
    exit 1
fi

# Instalar o novo pacote
echo "📥 Instalando novo pacote..."
npm install ./n8n-nodes-poli-0.1.0.tgz

# Verificar a instalação
echo "🔍 Verificando instalação..."
if npm list n8n-nodes-poli >/dev/null 2>&1; then
    echo "✅ Pacote instalado com sucesso!"
    
    # Listar os nodes que devem estar disponíveis
    echo ""
    echo "📋 Nodes que devem aparecer no n8n:"
    echo "   • Poli Trigger (Webhook trigger)"
    echo "   • Forward Contact (Encaminhar contato com opções condicionais)"
    echo "   • Send Template By Contact ID (Enviar template)"
    echo "   • Add Tag To Contact (Adicionar tag)"
    echo "   • Create App (Criar aplicação)"
    echo "   • Create Tag (Criar tag)"
    
    echo ""
    echo "🚀 Para iniciar o n8n:"
    echo "   npx n8n start"
    echo ""
    echo "💡 IMPORTANTE - Se os nodes ainda não aparecerem:"
    echo "   1. ✅ PRIMEIRO: Configure as credenciais 'Poli API' em Settings > Credentials"
    echo "   2. 🔍 Procure por 'Poli' na busca de nodes (não na categoria)"
    echo "   3. 🔄 Tente atualizar a página do n8n (Ctrl+F5)"
    echo "   4. 📋 Verifique se o pacote foi instalado: npm list n8n-nodes-poli"
    echo "   5. 🖥️ Verifique o console do navegador para erros JavaScript"
    
else
    echo "❌ Falha na instalação do pacote!"
    exit 1
fi
