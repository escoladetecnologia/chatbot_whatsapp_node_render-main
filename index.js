const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// Inicializando o app Express
const app = express();
const port = process.env.PORT || 3000; // Pegando a porta da variável de ambiente ou 3000 como fallback

// Configuração do WhatsApp Client usando LocalAuth para salvar a sessão localmente
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: 'whatsapp-bot', // Identificador único para a sessão do cliente
  }),
  puppeteer: {
    headless: true, // Modo headless (sem janela do navegador)
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
});

// Eventos do cliente WhatsApp
client.on('qr', (qr) => {
  // Gera e exibe o QR code no terminal
  qrcode.generate(qr, { small: true });
  console.log('QR Code gerado, escaneie com seu WhatsApp.');
});

client.on('ready', () => {
  console.log('WhatsApp conectado.');
});

// Salvando sessão localmente no arquivo
client.on('authenticated', (session) => {
  console.log('Sessão autenticada e salva localmente.');
});

client.on('auth_failure', () => {
  console.error('Falha na autenticação. Tente novamente.');
});

// Inicializando o cliente WhatsApp
client.initialize();

// Verificando se o WebSocket ainda está ativo a cada 5 minutos
const checkWebSocketConnection = () => {
  if (!client.info || !client.info.pushname) {
    console.log('WebSocket do WhatsApp desconectado. Tentando reconectar...');
    client.destroy().then(() => {
      client.initialize();
    });
  } else {
    console.log('WebSocket do WhatsApp ainda ativo.');
  }
};

setInterval(checkWebSocketConnection, 5 * 60 * 1000); // Verifica a conexão a cada 5 minutos

// Função para desconectar manualmente o WhatsApp e reiniciar a sessão
app.get('/disconnect', (req, res) => {
  client.logout().then(() => {
    console.log('WhatsApp desconectado. Nova sessão necessária.');
    client.initialize();
    res.send('WhatsApp desconectado. Novo QR Code será gerado em breve.');
  }).catch(err => {
    console.error('Erro ao desconectar:', err);
    res.status(500).send('Erro ao desconectar o WhatsApp.');
  });
});

// === INÍCIO DA LÓGICA DO SEU CHATBOT ===

// Quando o WhatsApp recebe uma mensagem
client.on('message', async msg => {
  console.log(`Mensagem recebida de ${msg.from}: ${msg.body}`);

  // Aqui você pode adicionar a lógica do seu chatbot, como verificar mensagens, responder, etc.

  // Exemplo básico de resposta
  if (msg.body.toLowerCase() === 'oi') {
    msg.reply('Olá! Como posso ajudar você hoje?');
  }

  // Respostas baseadas em palavras-chave
  if (msg.body.toLowerCase().includes('curso')) {
    msg.reply('Temos informações sobre diversos cursos, como o Cypecad. Como posso ajudar com isso?');
  }

  // Resposta padrão para mensagens não reconhecidas
  else {
    msg.reply('Desculpe, não entendi sua mensagem. Poderia reformular?');
  }
});

// === FIM DA LÓGICA DO SEU CHATBOT ===

// Configurando o servidor para escutar na porta correta
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
