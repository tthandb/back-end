const bcrypt = require('bcrypt')
const db = require('../config/database.js')

module.exports = {
  signUp: (userData, callback) => {
    userData.auth_token = module.exports.generateAuthToken()
    userData.password = bcrypt.hashSync(userData.password, 10)
    db.query('INSERT INTO users SET ?', userData, (error, result) => {
      if (!error) {
        const data = {
          user_id: result.insertId,
          username: userData.username,
          auth_token: userData.auth_token,
        }
        callback(0, data)
      } else callback(error)
    })
  },
  login: (userData, callback) => {
    const accessToken = module.exports.generateAuthToken()
    db.query('select id, password, auth_token from users where username = ?', userData.username, (error, result) => {
      if (!error) {
        if (result.length > 0) {
          const hashPassword = result[0].password
          if (bcrypt.compareSync(userData.password, hashPassword)) {
            db.query('insert into sessions set ?', { user_id: result[0].id, access_token: accessToken }, (error) => {
              if (!error) {
                callback(0, {
                  id: result[0].id,
                  username: userData.username,
                  auth_token: result[0].auth_token,
                  access_token: accessToken,
                })
              } else callback(error)
            })
          } else {
            callback(0, {
              message: 'password is not matched',
            })
          }
        }
      }
    })
  },
  logOut: (token, callback) => {
    db.query(
      'delete from sessions where access_token = ?',
      [token],
      (error) => {
        if (!error) callback(0, true)
        else callback(error)
      },
    )
  },
  getAllUsers: (callback) => {
    db.query('select id, username from users', (error, result) => {
      if (!error) {
        if (result.length > 0) callback(0, result)
      } else callback(error)
    })
  },
  generateAuthToken: () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&'
    let result = ''
    for (let i = 32; i > 0; --i) { result += chars[Math.floor(Math.random() * chars.length)] }
    return result
  },
}
