const db = require('../config/database.js')

module.exports = {
  api_authentication: function (api_key, callback) {
    db.query('SELECT * FROM api_auth WHERE api_token = ?', api_key, function (error, rows) {
      if (!error) {
        if (rows.length > 0) {
          callback(0, true);
        } else {
          callback(0, false);
        }
      } else
        callback(error);
    });
  },
  user_authentication: function (userData, callback) {
    db.query('select count(*) AS userCount from users where id = ? and auth_token = ?', [userData.user_id, userData.auth_token], function (error, rows) {
      if (!error) {
        if (rows[0].userCount) {
          callback(0, true);
        } else {
          callback(0, false);
        }
      } else
        callback(error);
    });
  },
  check_user_for_admin: function (user_id, auth_token, callback) {
    db.query('select user_role from users where id = ? and auth_token = ?', [user_id, auth_token], function (error, rows) {
      if (!error) {
        if (rows[0].user_role == 'admin') {
          callback(0, true);
        } else {
          callback(0, false);
        }
      } else
        console.log(error);
    });
  }
}