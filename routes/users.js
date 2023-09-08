const usersRouter = require('express').Router();
const {
  getUserInfo, updateUserInfo,
} = require('../controllers/users');
const { validateUpdateUserInfo } = require('../utils/validation');

// получение информации о текущем пользователе
usersRouter.get('/me', getUserInfo);

// обновление информации текущего пользователя
usersRouter.patch('/me', validateUpdateUserInfo, updateUserInfo);

module.exports = usersRouter;
