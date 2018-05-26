const express = require('express');
const { thumbnail, getImage } = require('../controllers/misc');

const miscRouter = express.Router();

miscRouter.get('/thumbnail', thumbnail);
miscRouter.get('/:id', getImage);

module.exports = {
  miscRouter
};
