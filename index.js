// Importando as bibliotecas necessárias
const delay = ms => new Promise(res => setTimeout(res, ms));
const qrcode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const express = require('express');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

// Conectando ao MongoDB
const uri = process.env.MONGODB_URI;
let store;

console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose.connect(uri)
    .then(() => {
        console.log("Conectado ao MongoDB");
        // Inicializando o MongoStore depois de confirmar a conexão com o MongoDB
        store = new MongoStore({ mongoose });
        initializeWhatsAppClient(); // Função que inicializa o cliente do WhatsApp
    })
    .catch(error => console.error("Erro ao conectar ao MongoDB", error));

// Função para inicializar o cliente do WhatsApp
function initializeWhatsAppClient() {
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000 // Sincroniza a cada 5 minutos
        })
    });

    // Evento para exibir QR Code no terminal e na aplicação
    client.on('qr', async qr => {
        qrcodeTerminal.generate(qr, { small: true });
        const qrCodeUrl = await qrcode.toDataURL(qr);
        console.log(`QR Code URL: ${qrCodeUrl}`); // Exibe a URL do QR Code no console
    });

    // Evento para confirmar quando o cliente está pronto
    client.on('ready', () => {
        console.log('Tudo certo! WhatsApp conectado.');
    });

    // Evento para salvar a sessão no MongoDB
    client.on('remote_session_saved', () => {
        console.log("Sessão salva no MongoDB.");
    });

    // Evento que ocorre quando a autenticação falha ou o cliente se desconecta
    client.on('disconnected', async (reason) => {
        console.log(`Cliente desconectado: ${reason}`);
        await client.initialize(); // Tenta reconectar
    });

    // Configurações de mensagens automáticas
    client.on('message', async msg => {
        if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|Olá ! Gostaria de tirar algumas dúvidas sobre o produto Curso Cypecad na Prática - Cálculo Estrutural - 1990516|cypecad|Cypecad|curso cypecad|Curso Cypecad|informacoes curso cypecad|informações curso cypecad)/i) && msg.from.endsWith('@c.us')) {
            const chat = await msg.getChat();
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            const contact = await msg.getContact();
            const name = contact.pushname || 'Cliente';
            await client.sendMessage(msg.from, `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da empresa Escola de Tecnologia. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Mais Informação - Curso Cypecad\n2 - Curso Cype 3D Metálicas\n3 - Outras perguntas`);
        }

        if (msg.body === '1' && msg.from.endsWith('@c.us')) {
            const chat = await msg.getChat();
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, `Aqui estão as informações sobre o Curso Cypecad:\n\nEnfrentar qualquer cálculo estrutural com Ajuda de Um Engenheiro Calculista Especialista e faturar de R$ 15.000 a R$ 50.000 ou mais com projetos de edifícios, sobrados, casas de acordo com a NBR6118 através do nosso método único VQS (Velocidade, Qualidade, Segurança), indo além de ser Piloto de Software.\n\nCalcular, Detalhar, Projetar e Analisar um projeto completo de concreto armado.\n\nDar um UP na sua Carreira, e obter os melhores empregos, salários e negócios.\n\nFazer Detalhamento de Vigas, Pilares, Lajes, Fundações.\n\nFazer cálculo de Fundações conforme NBR6122.\n\nFazer os Carregamentos conforme normas NBR 6120, barras NBR 7480, ventos NBR 6123, ações e combinações.`);
            await delay(1000);
            await client.sendMessage(msg.from, 'Curso Cypecad na Prática - Cálculo Estrutural: 12x R$ 34,90 ou R$ 349,00 à vista. Assim que o sistema confirmar o pagamento, você receberá os dados de acesso ao curso');
            await delay(1000);
            await client.sendMessage(msg.from, 'Você pode fazer a compra do curso através deste link: https://sun.eduzz.com/wcs7e6ps');
            await delay(1000);
            await client.sendMessage(msg.from, 'Te Vejo lá na Plataforma do Curso Cypecad 😊'); 
        }

        if (msg.body === '2' && msg.from.endsWith('@c.us')) {
            const chat = await msg.getChat();
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, `Aqui estão as informações sobre o Curso Cype 3D Metálicas:\n\nDomine o Cype 3D Estruturas Metálicas em VideoAulas Passo a Passo e Seja um Especialista em Cálculo Estrutural de Galpões Metálicos!\n\n Magno Moreira, Engenheiro de Elite, Revela o Método VQS para fazer Projetos de Estruturas Metálicas com mais Velocidade, Qualidade e Segurança.\n\nO Curso Cype 3D Estruturas Metálicas ensina na prática um projeto real de Galpão Metálico de 640m2 e Mezanino como calcular e dimensionar o projetos de estruturas metálicas de acordo com as normas brasileiras ((NBR 6120), barras (NBR 7480), ventos (NBR 6123), ações e combinações)`);
            await delay(1000);
            await client.sendMessage(msg.from, 'Curso Cype 3D Metálicas na Prática - Cálculo Estrutural de Galpões Metálicos: 12x R$ 34,90 ou R$ 349,00 à vista. Assim que o sistema confirmar o pagamento, você receberá os dados de acesso ao curso');
            await delay(1000);
            await client.sendMessage(msg.from, 'Você pode fazer a compra do curso através deste link: https://sun.eduzz.com/7czxg5un');
            await delay(1000);
            await client.sendMessage(msg.from, 'Te Vejo lá na Plataforma do Curso Cype 3D Metálicas 😊'); 
        }

        if (msg.body === '3' && msg.from.endsWith('@c.us')) {
            const chat = await msg.getChat();
            await delay(3000);
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, digite sua pergunta abaixo e aguarde a resposta');
            await delay(3000);
            await client.sendMessage(msg.from, 'Aguarde que um de nossos Atendentes irá responder a sua dúvida, caso queira conhecer todos os nossos cursos acesse o site: https://www.escoladetecnologia.com');
        }
    });

    // Inicializa o cliente
    client.initialize().catch(console.error);
}

// Inicia o servidor Express
const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para exibir o QR Code
app.get('/qrcode', async (req, res) => {
    res.send('<h1>QR Code gerado com sucesso!</h1><img src="' + qrCodeUrl + '" alt="QR Code" />');
});
