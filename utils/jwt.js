const debug = require('debug')('api:utils:jwt');
const jwt = require('jsonwebtoken');

module.exports.sign = function(payload) {

};

module.exports.verify = function (token) {
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
