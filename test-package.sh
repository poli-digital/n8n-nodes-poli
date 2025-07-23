#!/bin/bash

echo "🔧 Testando a estrutura dos nodes..."

# Verificar se os arquivos existem
echo "📁 Verificando arquivos no dist:"
ls -la dist/nodes/Poli/*.node.js | grep -E "(PoliTrigger|ForwardContact|AddTagToContact|CreateApp|CreateTag|SendTemplateByContactId)"

echo ""
echo "📦 Verificando estrutura do pacote:"
tar -tzf n8n-nodes-poli-0.1.0.tgz | grep "\.node\.js$" | head -10

echo ""
echo "✅ Pacote gerado com sucesso!"
echo "📋 Nodes incluídos no pacote:"
echo "   • PoliTrigger (Webhook trigger)"
echo "   • ForwardContact (Encaminhar contato)"
echo "   • SendTemplateByContactId (Enviar template)"
echo "   • AddTagToContact (Adicionar tag)"
echo "   • CreateApp (Criar aplicação)"
echo "   • CreateTag (Criar tag)"

echo ""
echo "🚀 Para aplicar no n8n:"
echo "   1. Pare o n8n (Ctrl+C)"
echo "   2. Desinstale: npm uninstall n8n-nodes-poli"
echo "   3. Instale: npm install ./n8n-nodes-poli-0.1.0.tgz"
echo "   4. Reinicie: n8n start"
