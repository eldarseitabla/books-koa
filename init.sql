CREATE DATABASE IF NOT EXISTS books_koa_db
    DEFAULT CHARACTER SET = utf8
    DEFAULT COLLATE = utf8_unicode_ci;

USE books_koa_db;

-- Autors --
CREATE TABLE authors (
  id            INTEGER PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(255)    NOT NULL
)
  ENGINE InnoDB
  DEFAULT CHARSET = UTF8;

-- Books --
CREATE TABLE books (
  id            INTEGER PRIMARY KEY AUTO_INCREMENT,
  author_id     INTEGER         NOT NULL,
  title         VARCHAR(255)    NOT NULL,
  date          DATETIME        NOT NULL,
  description   TEXT            NOT NULL,
  created_at    DATETIME        NOT NULL,
  updated_at    DATETIME        NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors (id)
)
  ENGINE InnoDB
  DEFAULT CHARSET = UTF8;

-- Book`s images --
CREATE TABLE book_images (
  id            INTEGER PRIMARY KEY AUTO_INCREMENT,
  book_id       INTEGER NOT NULL,
  image         VARCHAR(255)    NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books (id),
  INDEX images_of_book_idx (id, book_id)
)
  ENGINE InnoDB
  DEFAULT CHARSET = UTF8;
