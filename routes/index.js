var express = require('express');
var router = express.Router();
var connection = require('../db/database.ts');

var crypto = require('crypto');
const { type } = require('os');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// login
router.post('/login', (req, res) => {
  const data = req.body.data;
  if(!data.username || !data.password){
      res.status(400);
      res.send({message: 'Invalid username or password!'});
      return;
  } else {

    let sql = '';

    if(data.type === 'customers') {
        sql = `SELECT * from customers where username = ? and password = ?`;
    } else if(data.type === 'restaurants'){
        sql = `select * from restaurants where username = ? and password = ?`;
    } else {
        sql = `select * from deliveryPerson where username = ? and password = ?`;
    }

      try {
          connection.query(sql, [data.username, data.password], (err, results) => {
              if(err) {
                  console.log(err);
  
                  res.status(400);
                  res.send({message: 'Invalid username or password!'});
                  return;
              }
              if(results.length > 0) {
                const userInfo = results[0];
                res.status(200);
                res.send({
                    ...userInfo,
                    type: data.type
                });
              } else {
                  res.status(400);
                  res.send({message: 'Invalid username or password!'});
                  console.log(results)
              }
             
          })
      } catch(err) {
          console.log(err)
      }
  }
});

// register
router.post('/register', (req, res) => {
    const data = req.body.data;
    let search_sql = '';
    if(data.type === 'customers') {
        search_sql = `select * from customers where username = ?`;
    } else if(data.type === 'restaurants'){
        search_sql = `select * from restaurants where username = ?`;
    } else {
        search_sql = `select * from deliveryPerson where username = ?`;
    }

    console.log(data);

    try {
        connection.query(search_sql, [data.username], (err, results) => {
            if(err) {
                console.log(err);
                res.status(400);
                res.send({message: 'Invalid username!'});
                return;
            }
            if(results.length > 0) {
                res.status(400);
                res.send({message: 'Error: Duplicate Username!'});
                console.log(results)
                return;
            } else {
                            
                let register_sql = '';
                if(data.type === 'customers') {
                    register_sql = `insert into customers (username, password,address, postcode,) values (?,?,?,?)`;
                } else if(data.type === 'restaurants'){
                    register_sql = `insert into restaurants (username, password, title, address, postcode) values (?,?,?,?,?)`;
                } else {
                    register_sql = `insert into deliveryPerson (username, password, address, postcode) values (?,?,?,?)`;
                }
                try {
                    let newData;
                    if(data.type === 'restaurants') {
                        newData = [data.username, data.password,data.title, data.address, data.postcode];
                    } else {
                        newData = [data.username, data.password, data.address, data.postcode];
                    }
                    connection.query(register_sql, newData, (err, results) => {
                        if(err) {
                            
                            console.log(err);
                            res.status(400);
                            res.send({message: 'Invalid input!'});
                            return;
                        } else {
                            res.status(200);
                            res.send({ message: 'Register successfully!' })
                        }
                    });
                } catch (err) {
                    console.log(err);
                }
            }
           
        })

    } catch(err) {
        console.log(err)
    }

  });


router.post('/search', (req, res) => {

    let data = req.body.data;

    let user_postcode = data.postcode;

    console.log('data', data);

    let distance = data.distance + user_postcode;
    let sql;

    if(data.name) {
        if(data.distance) {
            sql = `SELECT * FROM restaurants where title like '%${data.name}%' and postcode <= ${distance}`;
        } else {
            sql = `SELECT * FROM restaurants where title like '%${data.name}%'`;
        }
    } else {
        if(data.distance) {
            sql = `SELECT * FROM restaurants where postcode <= ${distance}`;
        } else {
            sql = `SELECT * FROM restaurants`;
        }
    }

    try {
        console.log(sql);
        connection.query(sql, (err, result) => {
            if(err) {
                console.error('ERROR' + err.stack);
                return res.status(500).json({
                    error: 'Fail to fetch'
                })
            } 
            console.log(result);
            res.json(result);
        });
    } catch (e) {
        console.log(e);
    }
    
})

router.post('/getRestaurant', (req, res) => {
    let data = req.body.data;

    let res_sql = 'select * from restaurants where title = ?;';

    try {
        console.log(data);
        connection.query(res_sql, [data], (err, result) => {
            if(err) {
                console.error('ERROR' + err.stack);
                return res.status(500).json({
                    error: 'Fail to fetch'
                })
            } 
            console.log(result);
            res.json(result);
        });
    } catch (e) {
        console.log(e);
    }
});

router.post('/getMenus', (req, res) => {
    let data = req.body.data;

    let res_sql = 'select * from menus M join restaurants R on M.restaurant_id = R.rid where R.title = ?;';

    try {
        console.log(data);
        connection.query(res_sql, [data], (err, result) => {
            if(err) {
                console.error('ERROR' + err.stack);
                return res.status(500).json({
                    error: 'Fail to fetch'
                })
            } 
            console.log(result);
            res.json(result);
        });
    } catch (e) {
        console.log(e);
    }
});


router.post('/order', (req, res) => {
    let data = req.body.data;
    console.log(data);
    var now = moment().format("YYYY-MM-DD hh:mm:ss");

    let order_sql = "insert into orders (customer_id, restaurant_id, items, total_price, order_time, status) values (?, ?, ?, ?, ?, ?);";

    try {
        connection.query(order_sql, [data.cid, data.items[0].rid, JSON.stringify(data.items), data.total, now, 'submitted'], (err, result) => {
            if(err) {
                console.error('ERROR' + err.stack);
                return res.status(500).json({
                    error: 'Fail to fetch'
                })
            }
            res.send({ message: 'Ordered successfully!' })
        });
    } catch(e) {
        console.log(e);
    }
    
});

router.post('/history', (req, res) => {
    let data = req.body.data;
    console.log(data);
    let history_sql;

    if(data.status === 'all') {
        history_sql = "select * from orders O join restaurants R on R.rid = O.restaurant_id where O.customer_id = ? order by O.order_time desc";

    } else {
        history_sql = "select * from orders O join restaurants R on R.rid = O.restaurant_id where O.customer_id = ? and O.status = ? order by O.order_time desc;";
    }

    try {
        connection.query(history_sql, [data.cid, data.status], (err, result) => {
            if(err) {
                console.error('ERROR' + err.stack);
                return res.status(500).json({
                    error: 'Fail to fetch'
                })
            } 
            res.json(result);
        });
    } catch(e) {
        console.log(e);
    }
});


module.exports = router;
