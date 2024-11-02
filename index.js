// Importando bibliotecas
import qrcode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import { Client } from 'whatsapp-web.js';
import express from 'express';

const app = express();
let latestQrCodeUrl = ''; // Variável para armazenar o QR code atualizado

// Inicializando o cliente do WhatsApp com configurações para Puppeteer
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] // Argumentos para contornar restrições
    }
});

// Opção de exibir QR Code no terminal e no navegador
client.on('qr', async qr => {
    qrcodeTerminal.generate(qr, { small: true });
    latestQrCodeUrl = await qrcode.toDataURL(qr, {
        errorCorrectionLevel: 'H',
        width: 300,
        margin: 2
    });
    console.log("QR Code atualizado e disponível em: https://chatbot-whatsapp-node-render.onrender.com/qrcode");
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

// Iniciar o servidor na porta especificada pela Render
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/qrcode para exibir QR Code`);
});

// Evento quando o cliente está pronto
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializa o cliente
client.initialize();

// Função para criar um delay entre as ações
const delay = ms => new Promise(res => setTimeout(res, ms));

// Enviar resposta automática
const sendAutoReply = async (msg, response) => {
    try {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(msg.from, response);
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
};

// Configurações de mensagens automáticas
client.on('message', async msg => {
    if (msg.body.match(/(menu|oi|Olá|olá|quero|mais|informação|curso)/i) && msg.from.endsWith('@c.us')) {
        const contact = await msg.getContact();
        const name = contact.pushname || "usuário";
        await sendAutoReply(msg, `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da empresa Escola de Tecnologia. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Mais Informação - Curso Cypecad\n2 - Curso Cype 3D Metálicas\n3 - Outras perguntas`);
    }

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        await sendAutoReply(msg, `Aqui estão as informações sobre o Curso Cypecad:\n\nEnfrentar qualquer cálculo estrutural com ajuda de um engenheiro calculista especialista e faturar de R$ 15.000 a R$ 50.000 ou mais com projetos de edifícios, sobrados, casas de acordo com a NBR6118 através do nosso método único VQS (Velocidade, Qualidade, Segurança), indo além de ser piloto de software.\n\nCalcular, detalhar, projetar e analisar um projeto completo de concreto armado.\n\nDar um UP na sua carreira e obter os melhores empregos, salários e negócios.\n\nFazer detalhamento de vigas, pilares, lajes e fundações.\n\nFazer cálculo de fundações conforme NBR6122.\n\nFazer os carregamentos conforme normas NBR 6120, barras NBR 7480, ventos NBR 6123, ações e combinações.`);
        await delay(1000);
        await client.sendMessage(msg.from, 'Curso Cypecad na Prática - Cálculo Estrutural: 12x R$ 34,90 ou R$ 349,00 à vista. Assim que o sistema confirmar o pagamento, você receberá os dados de acesso ao curso');
        await delay(1000);
        await client.sendMessage(msg.from, 'Você pode fazer a compra do curso através deste link: https://sun.eduzz.com/wcs7e6ps');
        await delay(1000);
        await client.sendMessage(msg.from, 'Te vejo lá na Plataforma do Curso Cypecad 😊'); 
    }

    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        await sendAutoReply(msg, `Aqui estão as informações sobre o Curso Cype 3D Metálicas:\n\nDomine o Cype 3D Estruturas Metálicas em videoaulas passo a passo e seja um especialista em cálculo estrutural de galpões metálicos!\n\nMagno Moreira, engenheiro de elite, revela o método VQS para fazer projetos de estruturas metálicas com mais velocidade, qualidade e segurança.\n\nO Curso Cype 3D Estruturas Metálicas ensina na prática um projeto real de galpão metálico de 640m2 e mezanino como calcular e dimensionar projetos de estruturas metálicas de acordo com as normas brasileiras (NBR 6120, NBR 7480, NBR 6123).`);
        await delay(1000);
        await client.sendMessage(msg.from, 'Curso Cype 3D Metálicas na Prática - Cálculo Estrutural de Galpões Metálicos: 12x R$ 34,90 ou R$ 349,00 à vista. Assim que o sistema confirmar o pagamento, você receberá os dados de acesso ao curso');
        await delay(1000);
        await client.sendMessage(msg.from, 'Você pode fazer a compra do curso através deste link: https://sun.eduzz.com/7czxg5un');
        await delay(1000);
        await client.sendMessage(msg.from, 'Te vejo lá na Plataforma do Curso Cype 3D Metálicas 😊'); 
    }

    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
        await sendAutoReply(msg, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, digite sua pergunta abaixo e aguarde a resposta.');
        await delay(3000);
        await client.sendMessage(msg.from, 'Aguarde que um de nossos atendentes irá responder a sua dúvida. Caso queira conhecer todos os nossos cursos, acesse o site: https://www.escoladetecnologia.com');
    }
});
