'use strict';

const faker = require('faker');
const SqlString = require('sqlstring');
const mysql = require('mysql');
const util = require('util');
const moment = require('moment');

const config = require('../config/config.json');

const connection = mysql.createConnection(config.mysql);


const amountOfElements = 1e5;

/**
 * TODO !!! Remove it before to production
 * @param {Function} queryAsync
 */
const truncate = async (queryAsync) => {
  await queryAsync('SET FOREIGN_KEY_CHECKS = 0');
  await queryAsync('TRUNCATE TABLE authors');
  await queryAsync('TRUNCATE TABLE books');
  await queryAsync('TRUNCATE TABLE book_images');
};

/**
 * @param {Function} queryAsync
 * @return {Promise<*>}
 */
const createAuthors = async (queryAsync) => {
  // Разбиваем на страницы чтобы порционно залить данныые в бд
  const pages = 10;
  const limit = amountOfElements / pages;

  for (let i = 1; i <= pages; i++) {
    const authorNames = [];
    for (let i = 1; i <= limit; i++) {
      const name = SqlString.escape(`${faker.name.firstName()} ${faker.name.lastName()}`);
      authorNames.push(`(${name})`);
    }
    await queryAsync(`INSERT INTO authors ( name ) VALUES ${authorNames.join(', ')}`);
  }
};

/**
 * @param {Function} queryAsync
 * @return {Promise<*>}
 */
const createBooks = async (queryAsync) => {
  // Разбиваем на страницы чтобы порционно залить данныые в бд
  const pages = 10;
  const limit = amountOfElements / pages;

  for (let curPage = 1; curPage <= pages; curPage++) {
    const offset = (curPage - 1) * limit;
    const authors = await queryAsync(`SELECT id FROM authors ORDER BY id LIMIT ${limit} OFFSET ${offset}`);
    const booksArray = [];
    for (let i = 0; i < authors.length; i++) {
      const authorId = authors[i]['id'];
      const title = SqlString.escape(faker.lorem.sentence());
      const date = SqlString.escape(moment(faker.date.past()).format('YYYY-MM-DD HH:mm:ss'));
      const description = SqlString.escape(faker.lorem.sentences());
      const createdAt = SqlString.escape(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
      booksArray.push(`(${authorId}, ${title}, ${date}, ${description}, ${createdAt}, ${createdAt})`);
    }
    await queryAsync(`INSERT INTO books (author_id, title, date, description, created_at, updated_at) VALUES ${booksArray.join(', ')}`);
  }
};

/**
 * @param {Function} queryAsync
 * @return {Promise<*>}
 */
const createImages = async (queryAsync) => {
  // Разбиваем на страницы чтобы порционно залить данныые в бд
  const pages = 10;
  const limit = amountOfElements / pages;

  for (let curPage = 1; curPage <= pages; curPage++) {
    const offset = (curPage - 1) * limit;
    const books = await queryAsync(`SELECT id FROM books ORDER BY id LIMIT ${limit} OFFSET ${offset}`);
    const imagesArray = [];
    for (let i = 0; i < books.length; i++) {
      // Add 2 images for 1 of book
      for (let j = 0; j < 2; j++) {
        const bookId = books[i]['id'];
        const image = SqlString.escape(faker.image.avatar());
        imagesArray.push(`(${bookId}, ${image})`);
      }
    }
    await queryAsync(`INSERT INTO book_images (book_id, image) VALUES ${imagesArray.join(', ')}`);
  }
};

// Endpoint
(async function () {
  try {
    await connection.connect();
    const queryAsync = util.promisify(connection.query).bind(connection);

    // TODO !!! Remove it before to production
    await truncate(queryAsync);

    await createAuthors(queryAsync);
    await createBooks(queryAsync);
    await createImages(queryAsync);

  } catch (err) {
    console.log('!!!ERRROR', err.message, err.stack);
  } finally {
    await connection.end();
  }
})();
