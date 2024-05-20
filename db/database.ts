const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ck951717',
    database: 'ClickNCrave'
});

connection.connect((err) => {
    if(err) {
        console.error(err.message);
        return;
    } else {
        console.log(`connection succeeded to ${connection.threadId}`);
    }
})

module.exports = connection;
