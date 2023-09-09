const JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'some-secret-key';
const BITFILMS_DB = 'mongodb://127.0.0.1:27017/bitfilmsdb';

module.exports = {
  JWT_SECRET,
  BITFILMS_DB,
};
