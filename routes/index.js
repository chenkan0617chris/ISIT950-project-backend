var express = require('express');
var router = express.Router();
var connection = require('../db/database.ts');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/login', (req, res) => {
  const data = req.body.data;
  console.log(req.body);
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


router.get('/user', (req, res) => {
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

module.exports = router;
