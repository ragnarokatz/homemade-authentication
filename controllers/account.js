const debug = require('debug')('api:controllers:account');
const Joi = require('joi');
const pool = require('../database/pool');

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

module.exports.validateRegister = function (account) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(account, registerSchema);
      resolve(result);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.validateLogin = function (account) {
  return new Promise((resolve, reject) => {
    try {
      result = Joi.attempt(account, loginSchema);
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

module.exports.verifyAccount = function (email) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await pool.connect();
      let accounts = await db.query(`SELECT * FROM accounts WHERE email = '${email}';`);
      if (accounts.rowCount == 0) {
        let err = 'account not found for email ' + email;
        reject(err);
      }
      if (accounts.rowCount > 1) {
        let err = 'multiple accounts found for email ' + email;
        reject(err);
      }
      let account = accounts.rows[0];

      resolve();
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};
