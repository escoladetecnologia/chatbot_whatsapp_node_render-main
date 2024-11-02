// Importando bibliotecas
const qrcode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();

let latestQrCodeUrl = ''; // Variável para armazenar o QR code atualizado
const uri = `mongodb+srv://escoladetecnologiaonline:${process.env.MONGODB_PASSWORD}@cluster0.hson3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const clientMongo = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db; // Variável para armazenar a conexão do banco de dados

// Inicializando o cliente do WhatsApp
const client = new Client();

// Conectar ao MongoDB
async function connectToMongo() {
  try {
    // Conectar o cliente ao servidor
    await clientMongo.connect();
    // Enviar um ping para confirmar uma conexão bem-sucedida
    await clientMongo.db("admin").command({ ping: 1 });
    console.log("Conectado ao MongoDB com sucesso!");
    db = clientMongo.db("nome_do_seu_banco"); // Altere para o nome do seu banco de dados
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
  }
}

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

// Iniciar o servidor para exibir QR Code no navegador na porta especificada pela Render
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}/qrcode para exibir QR Code`);
});

// Evento quando o cliente está pronto
client.on('ready', () => {
  console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializa o cliente e conecta ao MongoDB
client.initialize();
connectToMongo();

// Função para criar um delay entre as ações
const delay = ms => new Promise(res => setTimeout(res, ms));

// Configurações de mensagens automáticas
client.on('message', async msg => {
  // Exemplo de uso do MongoDB: você pode armazenar mensagens ou informações do usuário aqui.
  await db.collection('messages').insertOne({ body: msg.body, from: msg.from, date: new Date() });

  if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|quero|Quero|mais|informacao|informação|informações|saber|curso|matricula|Matricula|matrícula|Matrícula|comprar|comprar|duvida|dúvida|Duvida|Dúvida|Ajuda|ajuda|falar|Falar)/i) && msg.from.endsWith('@c.us')) {
      const chat = await msg.getChat();
      await delay(3000);
      await chat.sendStateTyping();
      await delay(3000);
      const contact = await msg.getContact();
      const name = contact.pushname;
      await client.sendMessage(msg.from, `Olá, ${name.split(" ")[0]}! Sou o assistente virtual da empresa Escola de Tecnologia. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Mais Informação - Curso Cypecad\n2 - Curso Cype 3D Metálicas\n3 - Outras perguntas`);
  }

  // Mensagens automáticas para opções 1, 2 e 3
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
      await client.sendMessage(msg.from, `Aqui estão as informações sobre o Curso Cype 3D Metálicas:\n\nDomine o Cype 3D Estruturas Metálicas em VideoAulas Passo a Passo e Seja um Especialista em Cálculo Estrutural de Galpões Metálicos!\n\n Magno Moreira, Engenheiro de Elite, Revela o Método VQS para fazer Projetos de Estruturas Metálicas com mais Velocidade, Qualidade e Segurança.\n\nO Curso Cype 3D Estruturas Metálicas ensina na prática um projeto real de Galpão Metálico de 640m2 e Mezanino como calcular e dimensionar o projetos de estruturas metálicas de acordo com as normas brasileiras ((NBR 6120), barras (NBR 7480), ventos (NBR 6123), ações e combinações.`);
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

// Lembre-se de incluir o código para fechar a conexão MongoDB quando o bot for interrompido, se necessário.

