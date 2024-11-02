import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI; // Usando a variável de ambiente
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Conecta o cliente ao servidor
    await client.connect();
    // Envia um ping para confirmar a conexão
    await client.db("admin").command({ ping: 1 });
    console.log("Conexão bem-sucedida ao MongoDB!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  } finally {
    // Assegura que o cliente será fechado quando terminar
    await client.close();
  }
}

run().catch(console.dir);
