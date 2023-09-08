const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
