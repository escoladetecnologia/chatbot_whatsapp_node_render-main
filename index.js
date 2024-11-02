const qrcode = require('qrcode'); // Biblioteca para gerar QR Code
const qrcodeTerminal = require('qrcode-terminal'); // Biblioteca para exibir QR Code no terminal
const { Client } = require('whatsapp-web.js');
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Configurando a URI do MongoDB usando uma variável de ambiente
const uri = process.env.MONGODB_URI; // Agora usando a variável de ambiente

// Criação do cliente MongoDB com opções da API
const clientMongoDB = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Inicializando o cliente do WhatsApp
const client = new Client();
const app = express();
const port = process.env.PORT || 4000;

// Função para conectar ao MongoDB e retornar a coleção
async function connectToMongoDB() {
    try {
        await clientMongoDB.connect();
        console.log("Conectado ao MongoDB!");
        return clientMongoDB.db("admin").collection("qrcodes"); // Usando o nome do banco "admin"
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB", error);
    }
}

// Rota para exibir o QR Code
app.get('/qrcode', async (req, res) => {
    const collection = await connectToMongoDB(); // Conecta ao MongoDB e obtém a coleção
    const qrCodeData = await collection.findOne({}); // Obtém o QR Code mais recente

    if (qrCodeData && qrCodeData.qrCode) {
        res.send(`
            <div style="text-align: center;">
                <h1>Escaneie o QR Code com o WhatsApp</h1>
                <img src="${qrCodeData.qrCode}" alt="QR Code para WhatsApp"/>
            </div>
        `);
    } else {
        res.send("QR Code não encontrado. Tente novamente.");
    }
});

// Evento quando o cliente está pronto
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Função para exibir QR Code no terminal e no link da aplicação
client.on('qr', async qr => {
    // Gera o QR Code no console de forma legível para terminais pequenos
    qrcodeTerminal.generate(qr, { small: true });

    // Gera o QR Code em formato de URL (base64) para exibição em uma página web
    const qrCodeUrl = await qrcode.toDataURL(qr);
    const collection = await connectToMongoDB(); // Conecta ao MongoDB e obtém a coleção

    // Salva o QR Code no banco de dados
    await collection.updateOne({}, { $set: { qrCode: qrCodeUrl } }, { upsert: true });
});

// Inicializa o cliente
client.initialize();

// Função para criar um delay entre as ações
const delay = ms => new Promise(res => setTimeout(res, ms));

// Configurações de mensagens automáticas
client.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|Olá ! Gostaria de tirar algumas dúvidas sobre o produto Curso Cypecad na Prática - Cálculo Estrutural - 1990516|cypecad|Cypecad|curso cypecad|Curso Cypecad|informacoes curso cypecad|informações curso cypecad)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname;
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

// Configurações do servidor Express
app.get('/', (req, res) => {
    res.send('Chatbot ativo!');
});

app.listen(port, () => {
    console.log(`Servidor HTTP escutando na porta ${port}`);
});
