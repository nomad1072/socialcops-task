const { login } = require('../controllers/auth');
const express = require('express');

const authRouter = express.Router();

authRouter.post('/login', login);

module.exports = {
  authRouter
};
