const db = require('../config/database.js')
module.exports = {
  signUp: function (userData, callback) {
    let auth_token = module.exports.generate_auth_token();
    userData.auth_token = auth_token;
    db.query('INSERT INTO users SET ?', userData, function (error, result) {
      if (!error) {
        let data = {
          user_id: result.insertId,
          email: userData.email,
          auth_token: userData.auth_token
        };
        callback(0, data);
      } else
        callback(error);
    });
  },
  signUp: function (userData, callback) {
    let auth_token = module.exports.generate_auth_token();
    userData.auth_token = auth_token;
    db.query('INSERT INTO users SET ?', userData, function (error, result) {
      if (!error) {
        let data = {
          user_id: result.insertId,
          email: userData.email,
          auth_token: userData.auth_token
        };
        callback(0, data);
      } else
        callback(error);
    });
  },
  generate_auth_token: function () {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&'
    let result = '';
    for (let i = 32; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}