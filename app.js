const express = require('express');
const winston = require('winston');
require('express-async-errors');
const expressWinston = require('express-winston');
const cors = require('cors');
const debug = require('debug');
const helmet = require('helmet');

const config = require('./config');

const app = express();
const port = config.PORT || 3000;
const log = debug('app:main');

// loggers and routine middlewares /////////////////////////////////////////////
app.use(express.json());
app.use(cors());
app.use(helmet());

const loggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true }),
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, make terse
  if (typeof global.it === 'function') {
    loggerOptions.level = 'http'; // for non-debug test runs, squelch entirely
  }
}
app.use(expressWinston.logger(loggerOptions));
// loggers and routine middlewares /////////////////////////////////////////////

// routes //////////////////////////////////////////////////////////////////////
// health check
app.get('/', (req, res) => res.status(200).send('ok'));

// default error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'something went wrong' });
  log(err);
});
// routes //////////////////////////////////////////////////////////////////////

module.exports = app.listen(port, () => {
  console.log(`
    Server running at http://localhost:${port}
    `);
});
