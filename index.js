

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
const { PORT, MONGODB_URI } = process.env;

app.use(bodyParser.json());


mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao mongodb:'));
db.once('open', () => console.log('conectado ao mongoDB'));

// configurando as rotas
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Endpoint não encontrado' });
});

// iniciando o nosso servidor... :)
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});