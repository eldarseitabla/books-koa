'use strict';

const mysql = require('mysql');
const util = require('util');

const { nameDbProviders } = require('./name-db-providers');

/**
 * In-memory mysql store.
 */
class MysqlProvider {
  constructor (config, logger) {
    this._logger = logger.getLogger('[mysql-provider]');
    this._connect = mysql.createConnection(config);

    this.queryAsync = util.promisify(this._connect.query).bind(this._connect);
    this.connectAsync = util.promisify(this._connect.connect).bind(this._connect);
    this.endAsync = util.promisify(this._connect.end).bind(this._connect);
  }

  /**
   * Database provider`s name
   *
   * @type {string}
   */
  get name () {
    return nameDbProviders.MYSQL;
  }

  async connect () {
    this._logger.info('Connect to MySQL');
    await this.connectAsync();
    return this;
  }

  async disconnect () {
    this._logger.debug('End connection of MySQL');
    await this.endAsync();
    return this;
  }
}

module.exports = { MysqlProvider };
