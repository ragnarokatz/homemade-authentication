/* create table */
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
    id serial PRIMARY KEY,
    email varchar(30) NOT NULL UNIQUE,
    passhash varchar(30) NOT NULL,
    salt varchar(20) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
);
