const debug = require('debug')('api:utils:crypto');
const bcrypt = require('bcrypt');

module.exports.generateSalt = function () {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(8, function (err, salt) {
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

module.exports.compareHash = function (password, passhash) {
  return new Promise(async (resolve, reject) => {
    bcrypt.compare(password, passhash, function (err, same) {
      if (err) {
        debug(message);
        reject(message);
      } else {
        resolve(same);
      }
    });
  });
};
