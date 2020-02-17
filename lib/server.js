'use strict';

require('dotenv').config();

if (!process.env.LOG4JS_CONFIG) {
  process.env.LOG4JS_CONFIG = 'config/logger/log4js.json';
}

const logger = require('log4js').getLogger('[server]');

const { app, databaseProviders } = require('./app');

const { HOST, PORT } = process.env;
const pid = process.pid;

const server = app.listen(PORT, HOST, async (error) => {
  if (!error) {
    await Promise.all(databaseProviders.map(dbProvider => dbProvider.providerInstance.connect()));

    logger.info(`Success running on the host: ${HOST} | port: ${PORT} | PID: ${pid}`);
  } else {
    logger.error({ message: 'Error start server', error });
  }
});

process.on('SIGINT', () => {
  logger.debug('SIGINT');
  server.close(async () => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    await Promise.all(databaseProviders.map(dbProvider => dbProvider.providerInstance.disconnect()));
    logger.debug('Server closing, bye!');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.debug('SIGTERM');
  server.close(async () => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    await Promise.all(databaseProviders.map(dbProvider => dbProvider.providerInstance.disconnect()));
    logger.debug('Server closing, bye!');
    process.exit(0);
  });
});
