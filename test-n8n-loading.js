// Teste avançado de carregamento como o n8n
const fs = require('fs');
const path = require('path');

console.log('🔬 Teste Avançado de Carregamento dos Nodes\n');

// Simular como o n8n carrega o package.json
const packageJsonPath = './dist/../package.json';
if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json não encontrado');
    process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log('📦 Package.json carregado:', packageJson.name, packageJson.version);

// Verificar configuração n8n
if (!packageJson.n8n) {
    console.log('❌ Configuração n8n não encontrada no package.json');
    process.exit(1);
}

console.log('🔧 Configuração n8n encontrada:');
console.log('   API Version:', packageJson.n8n.n8nNodesApiVersion);
console.log('   Credentials:', packageJson.n8n.credentials?.length || 0);
console.log('   Nodes:', packageJson.n8n.nodes?.length || 0);

// Testar carregamento das credenciais
console.log('\n🔐 Testando credenciais:');
for (const credPath of packageJson.n8n.credentials || []) {
    try {
        const fullPath = `./${credPath}`;
        console.log(`   Carregando: ${credPath}`);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`   ❌ Arquivo não existe: ${fullPath}`);
            continue;
        }
        
        const CredClass = require(fullPath);
        const credName = Object.keys(CredClass)[0];
        const credInstance = new CredClass[credName]();
        
        console.log(`   ✅ ${credName}: ${credInstance.displayName}`);
    } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
    }
}

// Testar carregamento dos nodes
console.log('\n🎯 Testando nodes:');
for (const nodePath of packageJson.n8n.nodes || []) {
    try {
        const fullPath = `./${nodePath}`;
        console.log(`   Carregando: ${nodePath}`);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`   ❌ Arquivo não existe: ${fullPath}`);
            continue;
        }
        
        const NodeClass = require(fullPath);
        const nodeName = Object.keys(NodeClass)[0];
        const nodeInstance = new NodeClass[nodeName]();
        
        // Verificar se implementa INodeType corretamente
        if (!nodeInstance.description) {
            console.log(`   ❌ ${nodeName}: Sem propriedade description`);
            continue;
        }
        
        const desc = nodeInstance.description;
        console.log(`   ✅ ${nodeName}:`);
        console.log(`      Display: ${desc.displayName}`);
        console.log(`      Name: ${desc.name}`);
        console.log(`      Icon: ${desc.icon || 'N/A'}`);
        console.log(`      Group: ${desc.group}`);
        console.log(`      Credentials: ${desc.credentials ? 'Sim' : 'Não'}`);
        
        // Verificar se é um trigger
        if (desc.group && desc.group.includes('trigger')) {
            console.log(`      🎯 TRIGGER NODE`);
        }
        
    } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
        console.log(`      Stack: ${error.stack?.split('\n')[1] || 'N/A'}`);
    }
}

console.log('\n🏁 Teste concluído');

// Verificar se existe um arquivo de índice
const indexPath = './dist/index.js';
if (fs.existsSync(indexPath)) {
    console.log('\n📋 Arquivo index.js encontrado - verificando exports...');
    try {
        const indexExports = require(indexPath);
        console.log('   Exports disponíveis:', Object.keys(indexExports));
    } catch (error) {
        console.log('   ❌ Erro ao carregar index.js:', error.message);
    }
} else {
    console.log('\n⚠️  Arquivo index.js não encontrado');
}
