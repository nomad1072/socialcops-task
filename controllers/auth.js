const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const { logger } = require('../util/misc');

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    logger.error({ error: 'Credentials cannot be empty' });
    return res.status(401).json({ error: 'Credentials cannot be empty' });
  }
  const token = jwt.sign({ username }, jwtSecret);
  return res.status(200).json({ token });
};
