const errorConstants = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// создание пользователя
module.exports.addUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(errorConstants.HTTP_STATUS_CREATED)
      .send({
        name: user.name, email: user.email,
      }))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(error);
    });
};

// обновление информации пользователя
module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(errorConstants.HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении информации о пользователе'));
      } else if (error.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь с указанным id не найден'));
      } else {
        next(error);
      }
    });
};

// аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      return res.status(errorConstants.HTTP_STATUS_OK).send({ token });
    })
    .catch(next);
};

// информация о текщем пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(errorConstants.HTTP_STATUS_OK).send(user))
    .catch(next);
};
