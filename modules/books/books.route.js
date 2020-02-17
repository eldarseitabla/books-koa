'use strict';

const { createController } = require('awilix-koa');

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = booksService => ({
  findBooks: async ctx => ctx.ok(await booksService.find(ctx.query)),
  getBook: async ctx => ctx.ok(await booksService.getOne(ctx.params.id)),
  createBook: async ctx =>
    ctx.created(await booksService.create(ctx.request.body)),
  updateBook: async ctx =>
    ctx.ok(await booksService.update(ctx.params.id, ctx.request.body)),
  removeBook: async ctx =>
    ctx.noContent(await booksService.remove(ctx.params.id))
});

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
module.exports = createController(api)
  .prefix('/books')
  .get('', 'findBooks')
  .get('/:id', 'getBook')
  .post('', 'createBook')
  .patch('/:id', 'updateBook')
  .delete('/:id', 'removeBook');
