const router = require('express').Router();
const { login, addUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { validateLogin, validateAddUser } = require('../utils/validation');

// авторизация
router.post('/signin', validateLogin, login);

// регистрация
router.post('/signup', validateAddUser, addUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
