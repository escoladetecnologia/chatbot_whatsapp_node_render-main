const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/get-ip', (req, res) => {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      console.log(data.ip);  // Isso ainda vai aparecer no log do console
      res.send(`Seu IP é: ${data.ip}`);
    })
    .catch(error => {
      console.error('Erro:', error);
      res.status(500).send('Erro ao obter IP');
    });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
