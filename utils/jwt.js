const debug = require('debug')('api:utils:jwt');
const jwt = require('jsonwebtoken');

let secret = 'privatekey';

module.exports.sign = function (payload) {
  return new Promise((resolve, reject) => {
    try {
      var token = jwt.sign(payload, secret, { expiresIn: '1h', algorithm: 'HS256' });
      debug(token);
      resolve(token);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};

module.exports.verify = function (token) {
  return new Promise((resolve, reject) => {
    try {
      var decoded = jwt.verify(token, secret);
      debug(decoded);
      resolve(decoded);
    } catch (err) {
      debug(err);
      reject(err);
    }
  });
};
