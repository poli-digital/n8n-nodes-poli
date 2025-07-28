# @poli-digital/n8n-nodes-poli

Node oficial da Poli para integração com o n8n (https://n8n.io)

Este pacote permite automatizar fluxos de trabalho usando a API da Poli(https://poli.digital), incluindo:

- Envio de mensagens via WhatsApp (texto, mídia e templates)
- Redirecionamento de contatos para atendentes
- Listagem de contatos, canais, etiquetas, templates, webhooks e aplicativos
- Recebimento de eventos em tempo real com webhooks
- Criação de aplicações e webhooks na Poli

> Ideal para conectar sua conta WhatsApp Business (WABA) com n8n em operações de CRM, marketing, atendimento e automações diversas.


🚀 Como Instalar

Via Community Nodes (Recomendado)

1. Vá para **Settings > Community Nodes** no n8n
2. Clique em **Install**
3. No campo de nome do pacote, digite:

   ```
   @poli-digital/n8n-nodes-poli
   ```

4. Aceite o aviso:  
   *"I understand the risks of installing unverified code from a public source"*
5. Clique em **Install**

Instalação Manual:

No diretório raiz do seu n8n, execute:

```bash
npm install @poli-digital/n8n-nodes-poli


🔐 Configuração de Credenciais

1. Vá para **Credentials** no n8n
2. Clique em **Add Credential**
3. Procure por **Poli API**
4. Preencha os campos:

   - **API Key**

 📘 Funcionalidades Suportadas

Este pacote permite:

- ✅ Enviar mensagens WhatsApp (texto, mídia ou templates)
- 📇 Listar contatos, canais, templates, etiquetas, apps e webhooks
- 🧠 Criar aplicações e webhooks personalizados
- 🔁 Encaminhar contatos para usuários ou time
- 🛎 Receber eventos em tempo real com o Poli Trigger

Acesse a documentação oficial da API Poli(https://developers.poli.digital/) para exemplos completos.


 🤝 Contribuindo

Contribuições são muito bem-vindas!

1. Faça um fork:  
   https://github.com/PedroPoli127/n8n-nodes-poli/fork

2. Crie sua branch:

   ```bash
   git checkout -b feature/nome-da-sua-feature


3. Commit das alterações:

   ```bash
   git commit -m "feat: adiciona nova funcionalidade"
  

4. Envie sua branch:

   ```bash
   git push origin feature/nome-da-sua-feature
   ```

5. Abra um Pull Request 🎉



📦 Publicando o Pacote (npm)

Se quiser atualizar o `README.md` ou qualquer funcionalidade:

```bash
npm version patch
npm publish


 💬 Suporte:

📧 Email: pedro.melo@poli.digital
🐛 Ou abra uma issue (https://github.com/PedroPoli127/n8n-nodes-poli/issues)
