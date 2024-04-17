
const express = require('express');

const app = express();

const cors = require('cors');

const port = 5000;


app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

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


// type LoginForm = {
//     email: string,
//     password: string
// }
app.post('/login', (req, res) => {
    const data = req.body.data;

    if(!data.email || !data.password){
        res.status(400);
        res.send({message: 'Invalid username or password!'});
        return;
    } else {
        const sql = 'SELECT * from USER where uname = ?';

        try {
            connection.query(sql, data.email, (err, results) => {
                if(err) {
                    console.log(err);
    
                    res.status(400);
                    res.send({message: 'Invalid username!'});
                    return;
                }
                if(results.length > 0) {
                    const result = results[0];
                    if(result['PASSWORD'] !== data.password){
                        res.status(400);
                        res.send({message: 'Incorrect password!'});
                    } else {
                        const userInfo = {
                            username: result['UNAME'],
                            role: result['UROLE']
                        }
                        res.status(200);
                        res.send({userInfo});
                    }
                } else {
                    res.status(400);
                    res.send({message: 'Invalid username!'});
                    console.log(results)
                }
               
            })
        } catch(err) {
            console.log(err)
        }
        
    }

    
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