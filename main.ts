const express = require('express');

const app = express();

const cors = require('cors');

const port = 5000;

app.use(cors());




const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ck951717',
    database: 'ISIT950'
});

connection.connect((err) => {
    if(err) {
        console.error(err.message);
        return;
    } else {
        console.log(`connection succeeded to ${connection.threadId}`);
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/user', (req, res) => {
    connection.query('SELECT * FROM USER', (err, result) => {
        if(err) {
            console.error('ERROR' + err.stack);
            return res.status(500).json({
                error: 'Fail to fetch'
            })
        } 
        
        res.json(result);
    });
})


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})