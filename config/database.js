const mysql = require('mysql')

const db_config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodejs'
}
let connection
const handleDisconnect = () => {
  connection = mysql.createConnection(db_config)
  connection.connect(err => {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  })
  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}
handleDisconnect();

module.exports = connection