var express = require('express');
var order_router = express.Router();
var connection = require('../db/database.ts');

var crypto = require('crypto');
const { type } = require('os');


module.exports = order_router;