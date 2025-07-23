# Como Aplicar as Mudanças no n8n

## O Problema
O n8n não está mostrando as alterações porque ele carrega os nós na inicialização e mantém em cache. É necessário forçar o recarregamento.

## Soluções (escolha uma):

### ✅ **Opção 1: Reinstalar o Pacote (Recomendado)**

Se você instalou como pacote npm:

```bash
# 1. Desinstalar o pacote atual
npm uninstall n8n-nodes-poli

# 2. Instalar o novo pacote
npm install /workspaces/n8n-nodes-poli/n8n-nodes-poli-0.1.0.tgz

# 3. Reiniciar o n8n
npm start
# ou
n8n start
```

### ✅ **Opção 2: Desenvolvimento Local**

Se você está desenvolvendo localmente:

```bash
# 1. Parar o n8n (Ctrl+C)

# 2. Limpar cache do n8n (se existir)


# 3. Rebuild do projeto
npm run build

# 4. Reinstalar globalmente
npm install -g .

# 5. Reiniciar o n8n
n8n start
```

### ✅ **Opção 3: Docker (se usando Docker)**

```bash
# 1. Parar o container
docker stop n8n

# 2. Remover o container
docker rm n8n

# 3. Rebuild da imagem (se customizada)
docker build -t n8n-custom .

# 4. Reiniciar com volume atualizado
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8n-custom
```

### ✅ **Opção 4: n8n Development Mode**

Se você tem acesso ao modo de desenvolvimento:

```bash
# Usar o modo de desenvolvimento que recarrega automaticamente
n8n start --tunnel --dev
```

## Verificação das Mudanças

Após reiniciar o n8n:

1. **Vá para o n8n no navegador**
2. **Adicione o nó "Forward Contact"**
3. **Verifique se você vê:**
   - Campo "Encaminhar Para" com opções "Usuário" e "Equipe"
   - Campos aparecem/desaparecem conforme a seleção
   - Textos em português
   - Placeholders com exemplos de UUID

## Se Ainda Não Funcionar

### Cache do Navegador
- Pressione Ctrl+F5 ou Cmd+Shift+R para refresh completo
- Ou abra em aba anônima/privada

### Verificar Logs
```bash
# Verificar se há erros nos logs do n8n
tail -f ~/.n8n/logs/n8n.log
```

### Forçar Recompilação
```bash
# Limpar dist e recompilar
rm -rf dist/
npm run build
```

## Comandos para Este Projeto

Com base na estrutura atual:

```bash
# 1. Ensure clean build
npm run build

# 2. Se usando como pacote local
npm pack
# Isso gera: n8n-nodes-poli-0.1.0.tgz

# 3. Instalar no n8n (ajuste o caminho conforme necessário)
cd /path/to/your/n8n/installation
npm install /workspaces/n8n-nodes-poli/n8n-nodes-poli-0.1.0.tgz

# 4. Reiniciar n8n
n8n start
```

## Status das Alterações

✅ **Código corrigido**: ForwardContact.node.ts
✅ **Compilado**: dist/nodes/Poli/ForwardContact.node.js  
✅ **Pacote criado**: n8n-nodes-poli-0.1.0.tgz
⏳ **Pendente**: Reinicialização do n8n com novo pacote
