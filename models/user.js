

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  telefones: [{
    numero: String,
    ddd: String,
  }],
  data_criacao: { type: Date, default: Date.now },
  data_atualizacao: { type: Date, default: Date.now },
  ultimo_login: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);