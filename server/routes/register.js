var express = require('express');
var userMethods = require('../../database/methods/userMethods');
var db = require('../../database/authDB');

var router = express.Router()

router.post('/',
  userMethods.usernameCheck,
  userMethods.addUser
);

module.exports = router;
