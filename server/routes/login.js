var express = require('express');
var userMethods = require('../../database/methods/userMethods');
var db = require('../../database/authDB');

var router = express.Router()

router.post('/',
  userMethods.authenticate
);

module.exports = router;
