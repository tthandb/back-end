const db = require("../config/database.js");

module.exports = {
  signUp: (userData, callback) => {
    let auth_token = module.exports.generate_auth_token();
    userData.auth_token = auth_token;
    db.query("INSERT INTO users SET ?", userData, function (error, result) {
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
  generate_auth_token: () => {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&";
    let result = "";
    for (let i = 32; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  login: (userData, callback) => {
    console.log(userData.username);
    db.query(
      "select id, username, auth_token from users where username = ? and password = ?",
      [userData.username, userData.password],
      (error, result) => {
        if (!error) {
          console.log(result);
          if (result.length > 0) callback(0, result);
        } else callback(error);
      }
    );
  },
};
