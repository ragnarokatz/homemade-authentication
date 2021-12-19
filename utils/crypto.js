const debug = require('debug')('api:utils:crypto');
const bcrypt = require('bcrypt');

module.exports.generateSalt = function () {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(8, function (err, salt) {
      if (err) {
        debug(err);
        reject(err);
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
        debug(err);
        reject(err);
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
        debug(err);
        reject(err);
      } else {
        resolve(same);
      }
    });
  });
};
