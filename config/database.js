const mysql = require('mysql2');
const env = require('./env');
// const db_config = {
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'todo',
// };
let connection;
const handleDisconnect = () => {
  connection = mysql.createConnection(env.DB_CONFIG);
  connection.connect((err) => {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on('error', (err) => {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
};
handleDisconnect();

module.exports = connection;
