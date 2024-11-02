// Importando bibliotecas
import qrcode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Variáveis de ambiente para conexão com o MongoDB
const uri = process.env.MONGODB_URI; // Certifique-se de definir esta variável de ambiente no Render
const clientMongo = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Inicializando o cliente do WhatsApp
const app = express();
let latestQrCodeUrl = ''; // Variável para armazenar o QR code atualizado
const whatsappClient = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
});

// Conexão com o MongoDB
async function connectToMongoDB() {
    try {
        await clientMongo.connect();
        await clientMongo.db("admin").command({ ping: 1 });
        console.log("Conectado ao MongoDB com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
    }
}
connectToMongoDB();

// Opção de exibir QR Code no terminal e no navegador
whatsappClient.on('qr', async qr => {
    qrcodeTerminal.generate(qr, { small: true });
    
    try {
        latestQrCodeUrl = await qrcode.toDataURL(qr, {
            errorCorrectionLevel: 'H',
            width: 300,
            margin: 2
        });
        console.log("QR Code atualizado e disponível em: https://chatbot-whatsapp-node-render.onrender.com/qrcode");
    } catch (error) {
        console.error("Erro ao gerar QR Code:", error);
    }
});

// Rota para exibir o QR Code atualizado no navegador
app.get('/qrcode', (req, res) => {
    if (latestQrCodeUrl) {
        res.send(`
            <div style="text-align: center;">
                <h1>Escaneie o QR Code para conectar o WhatsApp</h1>
                <img src="${latestQrCodeUrl}" alt="QR Code do WhatsApp" />
            </div>
        `);
    } else {
        res.send('<h1>QR Code ainda não está disponível, tente novamente em alguns segundos.</h1>');
    }
});

// Iniciar o servidor para exibir QR Code no navegador na porta especificada pela Render
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/qrcode para exibir QR Code`);
});

// Evento quando o cliente está pronto
whatsappClient.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializa o cliente
whatsappClient.initialize();

// Função para criar um delay entre as ações
const delay = ms => new Promise(res => setTimeout(res, ms));

// Configurações de mensagens automáticas
whatsappClient.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|quero|Quero|mais|informacao|informação|informações|saber|curso|matricula|Matricula|matrícula|Matrícula|comprar|comprar|duvida|dúvida|Duvida|Dúvida|Ajuda|ajuda|falar|Falar)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname || "usuário";
        await whatsappClient.sendMessage(msg.from, `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da empresa Escola de Tecnologia. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Mais Informação - Curso Cypecad\n2 - Curso Cype 3D Metálicas\n3 - Outras perguntas`);
    }

    // Resposta para o curso Cypecad
    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await whatsappClient.sendMessage(msg.from, `Aqui estão as informações sobre o Curso Cypecad:\n\nEnfrentar qualquer cálculo estrutural com Ajuda de Um Engenheiro Calculista Especialista...`);
        // Continue com a mensagem do curso...
    }

    // Resposta para o curso Cype 3D Metálicas
    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await whatsappClient.sendMessage(msg.from, `Aqui estão as informações sobre o Curso Cype 3D Metálicas:\n\nDomine o Cype 3D Estruturas Metálicas em VideoAulas Passo a Passo...`);
        // Continue com a mensagem do curso...
    }

    // Resposta para outras perguntas
    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await whatsappClient.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, digite sua pergunta abaixo e aguarde a resposta.');
        // Continue com a mensagem de espera...
    }
});
