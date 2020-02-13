'use strict';

const { asValue } = require('awilix');

/**
 * Register Context helps to add request-specific data to the scope.
 * Imagine some auth middleware somewhere...
 */
const registerContext = async (ctx, next) => {
  ctx.state.container.register({
    userContext: asValue({
      user: 'username'
    })
  });
  return next();
};

module.exports = { registerContext };
