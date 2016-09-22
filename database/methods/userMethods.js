var mongoose = require('mongoose');
var Model = require('../model/userModel');

// usernameCheck checks if username already exists
// before adding a new username to database.
function usernameCheck(req, res, next) {
  Model.User.findOne({ username: req.body.username }, function (error, user) {
    if (user === null) {
      next();
    } else {
      res.status(409).send('Username exists. Choose another username');
    }
  });
}

// adds new user to the database
function addUser(req, res, next) {
  var newUser = {
    username: req.body.username,
    password: req.body.password,
  };

  Model.User.create(newUser, function (error, result) {
    if (error) {
      res.status(500).send('Server Error');
    } else {
      // Can add next() or other response.
      res.status(200).send('Account Created');
    }
  });
}

// authenticate checks username and password vs. database info.
// If information doesn't match or is incomplete responds with Permission Denied.
// Response can be more specific but prefer general response for security purposes.
function authenticate(req, res, next) {
  if (!req.body.username) {
    res.status(400).send('Permission Denied');
    return;
  }
  if (!req.body.password) {
    res.status(400).send('Permission Denied');
    return;
  }
  Model.User.findOne({ username: req.body.username }, function (error, user) {
    if (error) {
      res.status(500).send('Server Error');
    }

    if (user === null) {
      res.status(400).send('Permission Denied');
    }

    user.comparePassword(req.body.password, function (err, isMatch) {
      if (err) {
        res.status(500).send('Server Error');
      }
      if (!isMatch) {
        res.status(400).send('Permission Denied');
      } else {
        // Can add next() or other access granting privileges.
        res.status(200).send('Access Granted');
      }
    });
  });
}

module.exports = {
  usernameCheck: usernameCheck,
  addUser: addUser,
  authenticate: authenticate
};
