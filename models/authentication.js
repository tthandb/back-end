const db = require("../config/database.js");

module.exports = {
  api_authentication: (apiKey, callback) => {
    db.query(
      "SELECT * FROM api_auth WHERE api_token = ?",
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
  user_authentication: (userData, callback) => {
    db.query(
      "select count(*) AS userCount from users where id = ? and auth_token = ?",
      [userData.user_id, userData.auth_token],
      function (error, rows) {
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
};
