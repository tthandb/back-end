const db = require('../config/database.js')

module.exports = {
  viewStatus: (statusId, callback) => {
    module.exports.checkStatusExist(statusId, (err, result) => {
      if (err) {
        callback(err)
      } else if (result === true) {
        db.query(
          'select * from statuses where id = ?',
          [statusId],
          (error, result) => {
            if (!error) {
              callback(0, result)
            } else {
              callback(error)
            }
          },
        )
      } else {
        callback(0, false)
      }
    })
  },
  viewAllStatuses: (callback) => {
    db.query('select * from statuses', (error, result) => {
      if (!error) {
        callback(0, result)
      } else {
        callback(error)
      }
    })
  },
  checkStatusExist: (statusId, callback) => {
    db.query(
      'select count(*) as status_count from statuses where id = ?',
      [statusId],
      (error, rows) => {
        if (!error) {
          if (rows[0].status_count) {
            callback(0, true)
          } else {
            callback(0, false)
          }
        } else {
          callback(error)
        }
      },
    )
  },
}
