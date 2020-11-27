const db = require('../config/database.js');

module.exports = {
  signUp: (userData, callback) => {
    userData.auth_token = module.exports.generateAuthToken();
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
  login: (userData, callback) => {
    const access_token = module.exports.generateAuthToken();
    db.query(
      'select id, username from users where username = ? and password = ?',
      [userData.username, userData.password],
      (error, result) => {
        if (!error) {
          if (result.length > 0) {
            const data = result[0];
            db.query('insert into sessions set ?', { user_id: data.id, access_token }, (error, result) => {
              if (!error) {
                callback(0, { ...data, access_token });
              } else callback(error);
            });
          } else callback(error);
        }
      },
    );
  },
  logOut: (token, callback) => {
    db.query(
      'delete from sessions where access_token = ?',
      [token],
      (error) => {
        if (!error) callback(0, true);
        else callback(error);
      },
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
      },
    );
  },
  generateAuthToken: () => {
    let chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&';
    let result = '';
    for (let i = 32; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
};