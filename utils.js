const debug = require('debug')('api:utils');
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

module.exports.hash = function (password, salt, pepper) {
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
