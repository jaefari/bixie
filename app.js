const express = require('express');
const winston = require('winston');
require('express-async-errors');
const expressWinston = require('express-winston');
const cors = require('cors');
const debug = require('debug');
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerStats = require('swagger-stats');

const config = require('./config');

const app = express();
const port = config.PORT || 3000;
const log = debug('app:main');

require('./utils/periodicSnapshotDownloader');

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

// swagger /////////////////////////////////////////////////////////////////////
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bixie',
      version: '1.0.0',
    },
    servers: [{ url: `${config.APP_URL}:${port}/api/v1` }],
  },
  apis: ['./routes/*.route.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
if (config.NODE_ENV === 'production') app.use(swaggerStats.getMiddleware({ swaggerSpec }));
// swagger /////////////////////////////////////////////////////////////////////

// routes //////////////////////////////////////////////////////////////////////
// health check
app.get('/', (req, res) => res.status(200).send('ok'));

const stationsRouter = require('./routes/stations.route');

app.use(`${config.API_PREFIX}/stations`, stationsRouter);

// default error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'something went wrong' });
  log(err);
});
// routes //////////////////////////////////////////////////////////////////////

module.exports = app.listen(port, () => {
  console.log(`
    Server running at ${config.APP_URL}:${port}
    Swagger doc running at ${config.APP_URL}:${port}/api-docs
    Stats running at ${config.APP_URL}:${port}/swagger-stats (only available with NODE_ENV=production)
    `);
});
