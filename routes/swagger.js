'use strict';

const { createController } = require('awilix-koa');

const api = swaggerService => ({
  swaggerYml: async ctx => ctx.ok(await swaggerService.find(ctx.query)),
  swaggerApi: async ctx => ctx.ok(await swaggerService.get(ctx.params.id))
});

