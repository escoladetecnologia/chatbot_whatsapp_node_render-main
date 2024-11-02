// Função para criar um delay entre as ações
const delay = ms => new Promise(res => setTimeout(res, ms));

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
        await delay(1000); // Aguardar 1 segundo antes de enviar o link de compra
        await client.sendMessage(msg.from, 'Você pode fazer a compra do curso através deste link: https://sun.eduzz.com/wcs7e6ps'); // Substitua [link de compra] pelo URL real
        await delay(1000); // Aguardar 1 segundo antes de enviar o link de compra
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
        await delay(1000); // Aguardar 1 segundo antes de enviar o link de compra
        await client.sendMessage(msg.from, 'Você pode fazer a compra do curso através deste link: https://sun.eduzz.com/7czxg5un'); // Substitua [link de compra] pelo URL real
        await delay(1000); // Aguardar 1 segundo antes de enviar o link de compra
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

// Configurações do servidor Express para servir o QR Code na web
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Chatbot ativo! Acesse /qrcode para visualizar o QR Code.');
});

app.listen(port, () => {
    console.log(`Servidor HTTP escutando na porta ${port}`);
});


