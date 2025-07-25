#!/bin/bash

echo "🔍 Investigando como instalar community packages no n8n"
echo "======================================================"

# Verificar onde o n8n está instalado
echo "📍 Localização do n8n:"
which n8n
n8n --version

echo ""
echo "📁 Verificando diretório de nodes do n8n:"
N8N_PATH=$(dirname $(which n8n))/../lib/node_modules/n8n
echo "   Path: $N8N_PATH"

if [ -d "$N8N_PATH" ]; then
    echo "   ✅ Diretório n8n encontrado"
    
    # Verificar se existe pasta de community packages
    if [ -d "$N8N_PATH/node_modules" ]; then
        echo "   📦 Diretório node_modules encontrado"
        ls -la "$N8N_PATH/node_modules" | grep n8n-nodes || echo "   Nenhum community package encontrado"
    fi
else
    echo "   ❌ Diretório n8n não encontrado"
fi

echo ""
echo "🏠 Verificando diretório home do usuário:"
if [ -d "$HOME/.n8n" ]; then
    echo "   ✅ Diretório ~/.n8n encontrado"
    ls -la "$HOME/.n8n/"
    
    if [ -d "$HOME/.n8n/nodes" ]; then
        echo "   📦 Diretório ~/.n8n/nodes encontrado"
        ls -la "$HOME/.n8n/nodes/"
    else
        echo "   📦 Diretório ~/.n8n/nodes não existe"
    fi
else
    echo "   📂 Diretório ~/.n8n não existe"
fi

echo ""
echo "💡 Métodos de instalação para testar:"
echo "   1. npm install -g n8n-nodes-poli@file:./n8n-nodes-poli-0.1.0.tgz"
echo "   2. Copiar para ~/.n8n/nodes/ (se existe)"
echo "   3. Instalar localmente e configurar N8N_COMMUNITY_PACKAGES"
echo "   4. Usar n8n com --tunnel para desenvolvimento"
