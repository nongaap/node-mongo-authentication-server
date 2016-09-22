var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var chai = require('chai');
var expect = chai.expect;
var User = require('../database/model/userModel');

//Testing User model and that password is getting hashed

describe('Auth DB Test', function() {

  before(function (done) {
    mongoose.connect('mongodb://localhost/testDB');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      console.log('We are connected!');
      done();
    });	
  });

  describe('Test Database', function() {
    it('User schema saves to Test Database', function(done) {
      var testUser = User.User({
        username: 'Happy',
        password: 'Test',
      });

      testUser.save(done);
    });

	it('Should not save incorrect object to Test Database', function(done) {
	  var wrongSave = User.User({
		username: 'Happy',
		xassword: 'Test'
	  });

	  wrongSave.save(err => { 
        if(err) { return done(); }
        throw new Error('Should generate error!');
      });
	});

    it('Should retrieve data from Test Database', function(done) {
      User.User.find({username: 'Happy'}, (err, user) => {
        if(err) {throw err;} 
        if(user.length === 0) {
          throw new Error('No data retrieved!');
        }
        done();
      });
    });

    it('Should not save the password as clear text', function(done) {
      User.User.findOne({username: 'Happy'}, (err, user) => {
        if(err) {throw err;} 
        if(user.password === 'Test') {
          throw new Error('Password saved as clear text!');
        }
        done();
      });
    });

    it('Should confirm password matches hashed password', function(done) {
      User.User.findOne({username: 'Happy'}, (err, user) => {
        if(err) {throw err;}
        user.comparePassword('Test', function(error, isMatch){
          if(error) {throw error;}
          if(!isMatch){
            throw new Error('Password is incorrect');
          }
        done();
        }); 
      });
    });
  });

  after(function(done){
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done);
    });
  });

});
