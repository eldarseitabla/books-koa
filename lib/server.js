'use strict';

require('dotenv').config();

if (!process.env.LOG4JS_CONFIG) {
  process.env.LOG4JS_CONFIG = '../config/logger/log4js.json';
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
  console.log('SIGINT');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  server.close(() => {
    process.exit(0);
  });
});
