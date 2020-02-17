'use strict';

const SqlString = require('sqlstring');
const moment = require('moment');

/**
 * In-memory books store.
 * For demo purposes, gets the logger injected.
 */
class BooksStore {
  constructor (logger, mysql) {
    this._logger = logger.getLogger('[books-store]');
    this._db = mysql;
  }

  /**
   * @param {number} limit
   * @param {number} offset
   * @return {Promise<*>}
   */
  async find (limit, offset) {
    this._logger.debug('Finding books');
    const books = await this._db.queryAsync(`SELECT a.id AS id, a.title AS title, a.date AS date, a.description AS description, a.created_at AS createdAt, a.updated_at AS updatedAt, b.id AS authorId, b.name AS authorName FROM books AS a LEFT JOIN authors AS b ON a.author_id = b.id LIMIT ${limit} OFFSET ${offset}`);
    return books;
  }

  async getOne (id) {
    this._logger.debug(`Getting todo with id ${id}`);
    const found = await this._db.queryAsync(`SELECT id FROM books WHERE id=${id}`);
    if (!found) {
      return null;
    }
    return found;
  }

  async create (data) {
    const date = SqlString.escape(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    const bookPrepared = `(${data.authorId}, ${data.title}, ${data.date}, ${data.description}, ${date}, ${date})`;
    const res = await this._db.queryAsync(`INSERT INTO books (author_id, title, date, description, created_at, updated_at) VALUES ${bookPrepared}`);
    this._logger.debug('Created new todo', bookPrepared);
    return res;
  }

  async update (id, data) {
    const res = await this._db.queryAsync(`UPDATE books SET author_id = ${data.authorId}, title = ${data.title}, date = ${data.date}, description = ${data.description}, created_at = ${data.createdAt}, updated_at = ${data.updatedAt} WHERE id = ${id}`);
    this._logger.debug(`Updated todo ${id}`, res);
    return res;
  }

  async remove (id) {
    // DELETE FROM `table_name` [WHERE condition];
    const res = await this._db.queryAsync(`DELETE books WHERE id = ${id}`);
    this._logger.debug(`Removed todo ${id}`, res);
    return res;
  }
}

module.exports = BooksStore;
