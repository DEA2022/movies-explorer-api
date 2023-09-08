require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes/index');
const { BITFILMS_DB } = require('./utils/config');
const handlerErrors = require('./middlewares/handlerErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose.connect(BITFILMS_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());

app.use(requestLogger);

app.use(limiter);

app.use(helmet());
app.use(express.json());

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(handlerErrors);

app.listen(PORT);
