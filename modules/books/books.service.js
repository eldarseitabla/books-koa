'use strict';

/**
 * Books Service.
 * Gets a books store injected.
 */
class BooksService {
  constructor (booksStore) {
    this.booksStore = booksStore;
  }

  async find (params) {
    let limit = params.limit || 10;
    const offset = params.offset || 0;
    if (limit > 100) { // TODO move to middleware
      limit = 100;
    }
    return this.booksStore.find(limit, offset);
  }

  async getOne (id) {
    return this.booksStore
      .getOne(id);
  }

  async create (data) {
    return this.booksStore.create(data);
  }

  async update (id, data) {
    // Check exists
    await this.getOne(id);

    return this.booksStore.update(id, data);
  }

  async remove (id) {
    // Check exists
    await this.getOne(id);
    return this.booksStore.remove(id);
  }
}

module.exports = BooksService;
