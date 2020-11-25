const db = require('../config/database.js');

module.exports = {
  signUp: (userData, callback) => {
    const authToken = module.exports.generateAuthToken();
    userData.auth_token = authToken;
    db.query('INSERT INTO users SET ?', userData, (error, result) => {
      if (!error) {
        let data = {
          user_id: result.insertId,
          username: userData.username,
          auth_token: userData.auth_token,
        };
        callback(0, data);
      } else callback(error);
    });
  },
  generateAuthToken: () => {
    let chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&';
    let result = '';
    for (let i = 32; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  login: (userData, callback) => {
    console.log(userData.username);
    db.query(
      'select id, username, auth_token from users where username = ? and password = ?',
      [userData.username, userData.password],
      (error, result) => {
        if (!error) {
          console.log(result);
          if (result.length > 0) callback(0, result);
        } else callback(error);
      }
    );
  },
  getUserInfo: (userData, callback) => {
    db.query(
      'select username from users where id = ?',
      [userData],
      (error, result) => {
        if (!error) {
          if (result.length > 0) callback(0, result);
        } else callback(error);
      }
    );
  },
};
