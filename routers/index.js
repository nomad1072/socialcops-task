const { authRouter } = require('./auth');
const { miscRouter } = require('./misc');
const express = require('express');
const { jwtSecret } = require('../config');
const jwt = require('jsonwebtoken');
const { logger } = require('../util/misc');
const jsonpatch = require('fast-json-patch');

const router = express.Router();

router.use('/auth', authRouter);

router.all('*', (req, res, next) => {
  try {
    const token = req.headers['x-jwt-token'];
    const decoded = jwt.verify(token, jwtSecret);
    const username = decoded && decoded.username;
    if (!username) {
      // log
      throw new Error();
    }
    next();
  } catch (e) {
    logger.error(e.name, e.message);
    return res.status(401).json(e);
  }
});

router.get('/ping', (req, res) => res.status(200).json({ ping: 'pong' }));
router.use('/image', miscRouter);
router.patch('/change', (req, res) => {
  try {
    let document = req.body.resource;
    const { patch } = req.body;
    document = jsonpatch.applyPatch(document, patch).newDocument;
    return res.status(200).json({ document });
  } catch (e) {
    return res.status(400).json({ err: e });
  }
});

module.exports = {
  router
};
