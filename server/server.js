var cluster = require('cluster');

if (cluster.isMaster) {

  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
  }

  // Listen for dying workers
  cluster.on('exit', function (worker) {

    console.log('Worker died :(', worker.id);
    cluster.fork();

    });

} else {

  var express = require('express');
  var path = require('path');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var register = require('./routes/register');
  var login = require('./routes/login');

  var port = 3000;

  var app = express();

  var server = app.listen(port, function() {
    console.log('listening on port 3000');
  });

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser());

  app.use(bodyParser.json());

  app.use('/register', register);

  app.use('/login', login);

  app.get('/', function (req, res) {
	res.status(200).send('Success');
  });

  app.all('*', function (req, res) {
	res.status(404).send('Nothing There');
  });

  module.exports = server;
}
