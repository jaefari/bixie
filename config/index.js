const dotenv = require('dotenv');

// if no env is defined use the ./config/development.env file
const dotenvResult = dotenv.config({ path: `config/${process.env.NODE_ENV || 'development'}.env` });
if (dotenvResult.error) throw dotenvResult.error;

// add each config parameter to the below object to be able to have access to it with config.
module.exports = {
  PORT: process.env.PORT,
  API_PREFIX: process.env.API_PREFIX,
  NODE_ENV: process.env.NODE_ENV,
};
