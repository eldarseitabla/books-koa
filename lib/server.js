'use strict';

require('dotenv').config();

if (!process.env.LOG4JS_CONFIG) {
  process.env.LOG4JS_CONFIG = 'config/logger/log4js.json';
}

const logger = require('log4js').getLogger('[server]');

const { app } = require('./app');

const { HOST, PORT } = process.env;
const pid = process.pid;

const server = app.listen(PORT, HOST, (error) => {
  if (!error) {
    logger.info(`Success running on the host: ${HOST} | port: ${PORT} | PID: ${pid}`);
  } else {
    logger.error({ message: 'Error start server', error });
    setTimeout(() => run(), 1000);
  }
});

process.on('SIGINT', () => {
  logger.debug('SIGINT');
  server.close(() => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    logger.debug('Server closing, bye!');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.debug('SIGTERM');
  server.close(() => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    logger.debug('Server closing, bye!');
    process.exit(0);
  });
});
