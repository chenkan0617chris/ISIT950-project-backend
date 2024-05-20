var express = require('express');
var router = express.Router();
var connection = require('../db/database.ts');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/updateSettings', function(req, res, next) {
  let data = req.body.data;

  let update_sql = 'update customers set name=?, phone=?, email=?, address=?, postcode=? where cid = ?'

  try {
    connection.query(update_sql, [data.name, data.phone, data.email, data.address, data.postcode, data.cid], (error, result) => {
      if(error) {
        console.log(error);
        res.status(400);
        res.send({message: 'Invalid username!'});
        return;
      }

      let userInfo_sql = 'select * from customers where cid = ?;';
      connection.query(userInfo_sql, [data.cid], (err, result) => {
        if(err) {
          console.log(err);
          res.status(400);
          res.send({message: err.message});
          return;
        }
        if(result.length > 0) {
          const userInfo = result[0];
          res.status(200);
          res.send({
              ...userInfo,
              type: 'customers',
          });
        }
      });
    })
  } catch (error) {
    console.error(error);
  }
});


router.post('/updateRestaurantSettings', function(req, res, next) {
  let data = req.body.data;

  console.log(data);

  let update_sql = 'update Restaurants set title=?, description=?, phone=?, email=?, address=?, postcode=? where rid = ?'

  try {
    connection.query(update_sql, [data.title, data.description, data.phone, data.email, data.address, data.postcode, data.rid], (error, result) => {
      if(error) {
        console.log(error);
        res.status(400);
        res.send({message: 'Invalid username!'});
        return;
      }

      let userInfo_sql = 'select * from Restaurants where rid = ?;';
      connection.query(userInfo_sql, [data.rid], (err, result) => {
        if(err) {
          console.log(err);
          res.status(400);
          res.send({message: err.message});
          return;
        }
        if(result.length > 0) {
          const userInfo = result[0];
          res.status(200);
          res.send({
              ...userInfo,
              type: 'restaurants',
          });
        }
      });
    })
  } catch (error) {
    console.error(error);
  }
});

router.post('/addDish', function(req, res, next) {

  let data = req.body.data;

  console.log(data);

  let available = data.available === 'true' ? true : false;

  let sql = "insert into menus (restaurant_id, name, price, description, available) values (?,?,?,?,?);";

  try {
    connection.query(sql, [data.rid, data.name, data.price, data.description, available], (error, result) => {
      if(error) {
        console.log(error);
        res.status(400);
        res.send({message: 'Invalid username!'});
        return;
      }
      res.status(200);
      res.send({message: 'Dish added successfully!'});

    })
  } catch (error) {
    console.error(error);
  }
});

router.post('/editDish', function(req, res, next) {

  let data = req.body.data;

  let available = data.available === 'true' ? true : false;

  let sql = "update menus set name = ?, price = ?, description = ?, available = ? where mid = ?;";

  try {
    connection.query(sql, [data.name, data.price, data.description, available, data.mid], (error, result) => {
      if(error) {
        console.log(error);
        res.status(400);
        res.send({message: 'Invalid username!'});
        return;
      }
      res.status(200);
      res.send({message: 'Dish edited successfully!'});

    })
  } catch (error) {
    console.error(error);
  }
});



module.exports = router;
