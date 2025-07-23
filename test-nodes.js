// Teste de carregamento dos nodes
const fs = require('fs');
const path = require('path');

console.log('🔍 Testando carregamento dos nodes...\n');

const nodeFiles = [
    'dist/nodes/Poli/PoliTrigger.node.js',
    'dist/nodes/Poli/ForwardContact.node.js', 
    'dist/nodes/Poli/SendTemplateByContactId.node.js',
    'dist/nodes/Poli/AddTagToContact.node.js',
    'dist/nodes/Poli/CreateApp.node.js',
    'dist/nodes/Poli/CreateTag.node.js'
];

for (const nodeFile of nodeFiles) {
    try {
        console.log(`📦 Testando: ${nodeFile}`);
        
        // Verificar se o arquivo existe
        if (!fs.existsSync(nodeFile)) {
            console.log(`   ❌ Arquivo não encontrado`);
            continue;
        }
        
        // Tentar carregar o módulo
        const NodeClass = require(`./${nodeFile}`);
        const className = Object.keys(NodeClass)[0];
        const nodeInstance = new NodeClass[className]();
        
        console.log(`   ✅ Classe: ${className}`);
        console.log(`   ✅ displayName: ${nodeInstance.description.displayName}`);
        console.log(`   ✅ name: ${nodeInstance.description.name}`);
        console.log(`   ✅ icon: ${nodeInstance.description.icon || 'N/A'}`);
        console.log(`   ✅ credentials: ${nodeInstance.description.credentials ? 'Sim' : 'Não'}`);
        console.log('');
        
    } catch (error) {
        console.log(`   ❌ Erro ao carregar: ${error.message}`);
        console.log('');
    }
}

console.log('🏁 Teste concluído');
