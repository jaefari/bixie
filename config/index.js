const dotenv = require('dotenv');

// if no env is defined use the ./config/development.env file
const dotenvResult = dotenv.config({ path: `config/${process.env.NODE_ENV || 'development'}.env` });
if (dotenvResult.error) throw dotenvResult.error;

// add each config parameter to the below object to be able to have access to it with config.
module.exports = {
  MONGODB_URL: process.env.MONGODB_URL,
  MONGODB_DBNAME: process.env.MONGODB_DBNAME,
  MONGODB_STATIONS_COLLECTION: process.env.MONGODB_STATIONS_COLLECTION,

  APP_URL: process.env.APP_URL,
  PORT: process.env.PORT,
  API_PREFIX: process.env.API_PREFIX,
  NODE_ENV: process.env.NODE_ENV,

  WEATHER_SERVICE_URL: process.env.WEATHER_SERVICE_URL,
  WEATHER_SERVICE_APPID: process.env.WEATHER_SERVICE_APPID,

  STATIONS_SERVICE_URL: process.env.STATIONS_SERVICE_URL,
};
