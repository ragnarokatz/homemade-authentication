const debug = require('debug')('api:controllers:account');
const Joi = require('joi');
const pool = require('../database/pool');

const accountRegisterSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .min(10)
    .max(30)
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(8)
    .max(20)
    .required(),
  confirmPassword: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(8)
    .max(20)
    .required(),
});

const accountLoginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .min(10)
    .max(30)
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]*$/)
    .min(8)
    .max(20)
    .required(),
});

module.exports.getAllAccounts = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let accounts = await db.query('SELECT * FROM accounts');
      resolve(accounts.rows);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.validateAccount = function (account) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(account, accountSchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.addAccount = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      var sql = `INSERT INTO accounts (username, description, age) VALUES ('${item.username}', '${item.description}', ${item.age}) RETURNING id;`;
      let result = await db.query(sql);
      resolve(result.rows[0]);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.getAccount = function (accountId) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let accounts = await db.query(`SELECT * FROM accounts WHERE id = ${accountId};`);
      if (accounts.rowCount == 0) {
        let err = 'account id does not exist';
        reject(err);
      }
      if (accounts.rowCount > 1) {
        let err = 'account id should be unique';
        reject(err);
      }
      resolve(accounts.rows[0]);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.updateAccount = function (accountId, item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      var sql = `UPDATE accounts SET username = '${item.username}', description = '${item.description}',  age= ${item.age} WHERE id = ${accountId};`;
      let result = await db.query(sql);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.deleteAccount = function (accountId) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      var sql = `DELETE FROM accounts WHERE id = ${accountId};`;
      let result = await db.query(sql);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};
