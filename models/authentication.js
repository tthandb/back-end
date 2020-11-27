const db = require("../config/database.js");

module.exports = {
  apiAuthentication: (apiKey, callback) => {
    db.query(
      "select * from api_auth where api_token = ?",
      apiKey,
      (error, rows) => {
        if (!error) {
          if (rows.length > 0) {
            callback(0, true);
          } else {
            callback(0, false);
          }
        } else callback(error);
      } 
    );
  },
  userAuthentication: (userData, callback) => {
    db.query(
      "select count(*) as userCount from users where id = ? and auth_token = ?",
      [userData.user_id, userData.auth_token],
      (error, rows) => {
        if (!error) {
          if (rows[0].userCount) {
            callback(0, true);
          } else {
            callback(0, false);
          }
        } else callback(error);
      }
    );
  },
  accessAuthentication: (userId, token, callback) => {
    db.query(
      "select * from sessions where access_token = ? and user_id = ?",
      [token, userId],
      (error, rows) => {
        if (!error) {
          if (rows.length > 0) {
            callback(0, true);
          } else {
            callback(0, false);
          }
        } else callback(error);
      }
    );
  },
};
