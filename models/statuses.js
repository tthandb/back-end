'use strict';
let db = require('../config/database.js');

module.exports = {
  viewStatus: (status_id, callback) => {
    module.exports.checkStatusExist(status_id, (err, result) => {
      if (err) {
        callback(err);
      } else {
        if (result === true) {
          db.query(
            'select * from statuses where id = ?',
            [status_id],
            (error, result) => {
              if (!error) {
                callback(0, result);
              } else callback(error);
            }
          );
        } else {
          callback(0, false);
        }
      }
    });
  },
  viewAllStatuses: (callback) => {
    db.query('select * from statuses', (error, result) => {
      if (!error) {
        callback(0, result);
      } else callback(error);
    });
  },
  checkStatusExist: function (status_id, callback) {
    db.query(
      'select count(*) as status_count from statuses where id = ?',
      [status_id],
      (error, rows) => {
        if (!error) {
          if (rows[0].status_count) {
            callback(0, true);
          } else {
            callback(0, false);
          }
        } else callback(error);
      }
    );
  },
};
