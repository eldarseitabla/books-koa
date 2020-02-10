'use strict';

const logger = require('log4js').getLogger('[error-handler]');
const config = require('../../config/config.json'); // TODO temporary

/**
 * Error handler middleware.
 * Uses status code from error if present.
 */
const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    /* istanbul ignore next */
    ctx.status = err.statusCode || 500;
    /* istanbul ignore next */
    ctx.body = err.toJSON ? err.toJSON() : { message: err.message, ...err };
    /* istanbul ignore next */
    if (!config.error.emitStackTrace) {
      delete ctx.body.stack;
    }
    logger.error('Error in request', err);
  }
};

module.exports = { errorHandler };
