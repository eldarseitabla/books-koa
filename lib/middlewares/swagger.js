'use strict';

const path = require('path');
const send = require('koa-send');
const koaSwagger = require('koa2-swagger-ui');

const swaggerYml = async (ctx, next) => {
  if ('/swagger.yaml' === ctx.path) {
    const dir = path.resolve(__dirname, '..', '..', 'public');
    await send(ctx, ctx.path, { root: dir });
  }
  await next();
};

const swaggerClient = () => {
  return koaSwagger({
    routePrefix: '/api',
    swaggerOptions: {
      url: 'http://localhost:3000/swagger.yaml',
    },
  });
};

module.exports = { swaggerYml, swaggerClient };
