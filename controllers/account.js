const debug = require('debug')('api:controllers:account');
const Joi = require('joi');
const pool = require('../database/pool');
const utils = require('../utils/crypto');

const registerSchema = Joi.object({
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

const loginSchema = Joi.object({
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

module.exports.validateRegister = function (item) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(item, registerSchema);

      if (item.password === item.confirmPassword) {
        resolve(result);
      } else {
        let message = 'password does not match confirm password';
        debug(message);
        reject(message);
      }
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.validateLogin = function (item) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(item, loginSchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.registerAccount = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let salt = await utils.generateSalt();
      let passhash = await utils.hash(item.password, salt);
      var sql = `INSERT INTO accounts (email, passhash) VALUES ('${item.email}', '${passhash}') RETURNING id;`;
      let result = await db.query(sql);
      resolve(result.rows[0]);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.verifyAccount = function (item) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let accounts = await db.query(`SELECT * FROM accounts WHERE email = '${item.email}';`);
      if (accounts.rowCount == 0) {
        let err = 'account not found for email ' + item.email;
        reject(err);
      }
      if (accounts.rowCount > 1) {
        let err = 'multiple accounts found for email ' + item.email;
        reject(err);
      }
      let account = accounts.rows[0];
      let result = await utils.compareHash(item.password, account.passhash);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};
