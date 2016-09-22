var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var chai = require('chai');
var request = require('supertest');
var app = require('../server/server.js');
var db = require('../database/authDB');
var User = require('../database/model/userModel');
var expect = chai.expect;

//Warning: This test runs test directly in authDB. It removes the Test2 user at the end.
describe('Auth DB Test', function() {

  describe( "Post Tests", function(){
    it('post to /register adds user to DB', function(done) {
      request(app)
        .post('/register')
        .send({ username: 'Test2', password: 'Test2'})
        .expect(200, 'Account Created')
        .end(function(err, res){
          if(err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('post to /register does not add user if username is taken', function(done) {
      request(app)
        .post('/register')
        .send({ username: 'Test2', password: 'Test2'})
        .expect(409, 'Username exists. Choose another username')
        .end(function(err, res){
          if(err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('post to /login grants access with correct username and password', function(done) {
      request(app)
        .post('/login')
        .send({ username: 'Test2', password: 'Test2'})
        .expect(200, 'Access Granted')
        .end(function(err, res){
          if(err) {
            done(err);
          } else {
            done();
          }
        });
    });

    it('post to /login denies access with incorrect password', function(done) {
      request(app)
        .post('/login')
        .send({ username: 'Test2', password: 'Test3'})
        .expect(400, 'Permission Denied')
        .end(function(err, res){
          if(err) {
            done(err);
          } else {
            done();
          }
        });
    });
  });

  after(function(done){
    User.User.find({username: 'Test2'}).remove().exec(function(err, data) {
      mongoose.connection.close(done);
    })
  });

});