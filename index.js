const qrcode = require('qrcode'); // Biblioteca para gerar QR Code
const qrcodeTerminal = require('qrcode-terminal'); // Biblioteca para exibir QR Code no terminal
const { Client, LocalAuth } = require('whatsapp-web.js'); // Inclui autenticação local
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Configurando a URI do MongoDB usando uma variável de ambiente
const uri = process.env.MONGODB_URI;

// Criação do cliente MongoDB com opções da API
const clientMongoDB = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Inicializando o cliente do WhatsApp com autenticação local
const client = new Client({
    authStrategy: new LocalAuth() // Armazena a sessão localmente
});
let qrCodeUrl; // Variável para armazenar a URL do QR Code

// Função para conectar ao MongoDB e retornar a coleção
async function connectToMongoDB() {
    try {
        await clientMongoDB.connect();
        console.log("Conectado ao MongoDB!");
        return clientMongoDB.db("admin").collection("qrcodes");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB", error);
    }
}

// Define um endpoint para exibir o QR Code na interface web
const app = express();
app.get('/qrcode', (req, res) => {
    if (qrCodeUrl) {
        res.send(`
            <div style="text-align: center;">
                <h1>Escaneie o QR Code com o WhatsApp</h1>
                <img src="${qrCodeUrl}" alt="QR Code para WhatsApp"/>
            </div>
        `);
    } else {
        res.send('QR Code ainda não gerado.');
    }
});

// Evento para exibir QR Code no terminal e no link da aplicação
client.on('qr', async qr => {
    qrcodeTerminal.generate(qr, { small: true });
    qrCodeUrl = await qrcode.toDataURL(qr);
});

// Evento quando o cliente está pronto
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializa o cliente
client.initialize();

// Configurações de mensagens automáticas
client.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|Olá ! Gostaria de tirar algumas dúvidas sobre o produto Curso Cypecad na Prática - Cálculo Estrutural - 1990516|cypecad|Cypecad|curso cypecad|Curso Cypecad|informacoes curso cypecad|informações curso cypecad)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname || 'Cliente';
        await client.sendMessage(msg.from, `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Mais Informação - Curso Cypecad\n2 - Valores Curso\n3 - Outras perguntas`);
    }

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'Aqui está um resumo objetivo do Curso Cypecad Online de Cálculo Estrutural...');
    }

    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'Curso Cypecad na Prática - Cálculo Estrutural 12x R$ 34,90 ou R$ 349,00 à vista.');
    }

    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, digite sua pergunta abaixo e aguarde a resposta');
    }
});

// Configurações do servidor Express para servir o QR Code na web
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Chatbot ativo! Acesse /qrcode para visualizar o QR Code.');
});

app.listen(port, () => {
    console.log(`Servidor HTTP escutando na porta ${port}`);
});

// Função para criar um delay entre as ações
const delay = ms => new Promise(res => setTimeout(res, ms));
