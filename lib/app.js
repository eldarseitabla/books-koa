'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const compress = require('koa-compress');
const respond = require('koa-respond');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = Router();

const { errorHandler } = require('./middlewares/error-handler');
const { swaggerYml, swaggerClient } = require('./middlewares/swagger');

// Top middleware is the error handler.
app.use(errorHandler);
// Compress all responses.
app.use(compress());
// Adds ctx.ok(), ctx.notFound(), etc..
app.use(respond());
// Handles CORS.
app.use(cors());
// Parses request bodies.
app.use(bodyParser());
// Swagger yaml file `/swagger.yaml`
app.use(swaggerYml);
// Swagger client `/api`
app.use(swaggerClient());

router.get('/', async ctx => {
  ctx.body = 'Hello!';
});

app.use(router.routes());

module.exports = { app };
