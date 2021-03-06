#!/usr/bin/env node

require( './db' );

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes');

var app = express();
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


if (app.get('env') === 'development') 
  var web3relay = require('./routes/web3dummy');
else
  var web3relay = require('./routes/web3relay');

// client

app.get('/', function(req, res) {
  res.render('index');
});

/* 
  data request format
  { "address": "0x1234blah", "txin": true } 
  { "tx": "0x1234blah" }
  { "block": "1234" }
*/
app.post('/addr', routes.addr);
app.post('/tx', routes.tx);
app.post('/block', routes.block);
app.post('/data', routes.data);
app.post('/web3relay', web3relay.data)

app.get('/test', function(req, res) {
  res.render('test');
});

// let angular catch them
app.use(function(req, res) {
  res.render('index');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var http = require('http').Server(app);
var io = require('socket.io')(http);

// web3socket(io);

http.listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});