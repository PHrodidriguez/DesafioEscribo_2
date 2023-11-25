

const express = require('express');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { nome, email, senha, telefones } = req.body;

    // Verificando se o e-mail já está cadastrado... :)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ mensagem: 'E-mail já existente' });
    }

// Criptografando a senha...
    const hashedPassword = await bcrypt.hash(senha, 10);

// Criando o usuário
    const user = new User({
      nome,
      email,
      senha: hashedPassword,
      telefones,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '30m' });

    res.json({
      id: user._id,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro do servidor');
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // buscar o usuario
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválido' });
    }

    // Atualização da última data de login
    user.ultimo_login = Date.now();
    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '30m' });

    res.json({
      id: user._id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro  do servidor');
  }
});

router.get('/user', authMiddleware, (req, res) => {
  try {
    const { user } = req;
    res.json({
      id: user.id,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      ultimo_login: user.ultimo_login,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;