var express = require('express');
var router = express.Router();
var connection = require('../db/database.ts');
var moment = require('moment');

var crypto = require('crypto');
const { type } = require('os');

router.post('/order', (req, res) => {
    let data = req.body.data;
    var now = moment().format("YYYY-MM-DD H:mm:ss");

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

router.post('/orderList', (req, res) => {
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

router.post('/allOrderList', (req, res) => {
    let data = req.body.data;
    console.log(data);
    let sql;

    if(data.status === 'all') {
        sql = "select * from orders O join restaurants R on R.rid = O.restaurant_id order by O.order_time desc";

    } else {
        sql = "select * from orders O join restaurants R on R.rid = O.restaurant_id where O.status = ? order by O.order_time desc;";
    }

    try {
        connection.query(sql, [data.status], (err, result) => {
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



router.post('/restaurantOrderList', (req, res) => {
    let data = req.body.data;
    console.log(data);
    let history_sql;

    if(data.status === 'all') {
        history_sql = "select * from orders O join restaurants R on R.rid = O.restaurant_id where R.rid = ? order by O.order_time desc";

    } else {
        history_sql = "select * from orders O join restaurants R on R.rid = O.restaurant_id where R.rid = ? and O.status = ? order by O.order_time desc;";
    }

    try {
        connection.query(history_sql, [data.rid, data.status], (err, result) => {
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

router.post('/restaurantConfirmOrder', (req, res) => {
    let data = req.body.data;
    console.log(data);
    let select_sql = "select O.order_time, (C.postcode - R.postcode) as estimate_time from orders O join customers C on O.customer_id = C.cid join restaurants R on O.restaurant_id = R.rid where O.oid = ?;";

    try {
        connection.query(select_sql, [data.oid], (err, result) => {
            if(err) {
                console.error('ERROR' + err.stack);
                return res.status(500).json({
                    error: 'Fail to fetch'
                })
            }

            const estimate_time = result[0]?.estimate_time;

            let confirm_sql = `update orders set status = 'processing', estimate_time = ${estimate_time} where oid = ?;`;

            try {
                connection.query(confirm_sql, [data.oid], (err, result) => {
                    if(err) {
                        console.error('ERROR' + err.stack);
                        return res.status(500).json({
                            error: 'Fail to fetch'
                        })
                    }
                    res.status(200);
                    res.send({ message: 'Order confirmed successfully!' })
                });
            } catch(e) {
                console.log(e);
            }
        });
    } catch(e) {
        console.log(e);
    }
});

router.post('/restaurantProcessedOrder', (req, res) => {
    let data = req.body.data;

    let confirm_sql = `update orders set status = 'processed' where oid = ?;`;

    try {
        connection.query(confirm_sql, [data.oid], (err, result) => {
            if(err) {
                console.error('ERROR' + err.stack);
                return res.status(500).json({
                    error: 'Fail to fetch'
                })
            }
            res.status(200);
            res.send({ message: 'Order confirmed successfully!' })
        });
    } catch(e) {
        console.log(e);
    }

});

router.post('/restaurantDeliveringOrder', (req, res) => {
    let data = req.body.data;

    let confirm_sql = `update orders set status = 'delivering' where oid = ?;`;

    try {
        connection.query(confirm_sql, [data.oid], (err, result) => {
            if(err) {
                console.error('ERROR' + err.stack);
                return res.status(500).json({
                    error: 'Fail to fetch'
                })
            }

            let sql = 'insert into delivery (order_id, deliveryperson_id) values (?,?);';

            connection.query(sql, [data.oid, data.did], (err, result) => {
                if(err) {
                    console.error('ERROR' + err.stack);
                    return res.status(500).json({
                        error: 'Fail to fetch'
                    })
                }
    
                res.status(200);
                res.send({ message: 'Order confirmed successfully!' })
            });

        });
    } catch(e) {
        console.log(e);
    }

});

router.post('/restaurantCompleteOrder', (req, res) => {
    let data = req.body.data;
    var now = moment().format("YYYY-MM-DD H:mm:ss");

    let confirm_sql = `update orders set status = 'completed', finish_time = ? where oid = ?;`;

    try {
        connection.query(confirm_sql, [now, data.oid], (err, result) => {
            if(err) {
                console.error('ERROR' + err.stack);
                return res.status(500).json({
                    error: 'Fail to fetch'
                })
            }
            res.status(200);
            res.send({ message: 'Order confirmed successfully!' })
        });
    } catch(e) {
        console.log(e);
    }

});




module.exports = router;