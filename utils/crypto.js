const debug = require('debug')('api:utils:crypto');
const bcrypt = require('bcryptjs');

module.exports.generateSalt = function () {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        var message = 'There was an error generating salt';
        debug(message);
        reject(message);
      } else {
        resolve(salt);
      }
    });
  });
};

module.exports.hash = function (password, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        var message = 'There was an error encrypting the password';
        debug(message);
        reject(message);
      } else {
        resolve(hash);
      }
    });
  });
};

module.exports.compareHash = function (password, salt, passhash) {
  return new Promise(async (resolve, reject) => {
    let hash = await this.hash(password, salt);
    if (hash === passhash) {
      var message = 'the password hashes match';
      debug(message);
      resolve(message);
    } else {
      var message = 'the password hashes do not match';
      debug(message);
      reject(message);
    }
  });
};
