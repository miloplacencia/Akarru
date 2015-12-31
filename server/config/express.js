/**
 * Express configuration
 */

'use strict';

var express         = require('express');
//mandar favicon
var favicon         = require('serve-favicon');
//morgan express logger 
var morgan          = require('morgan');
//compression middleware
var compression     = require('compression');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var cookieParser    = require('cookie-parser');
var errorHandler    = require('errorhandler');
var path            = require('path');
var config          = require('./environment');
var passport        = require('passport');
var session         = require('express-session');
var mongoStore      = require('connect-mongo')(session);
var mongoose        = require('mongoose');


module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  


  var sessionStore = new mongoStore(
    { mongoose_connection: mongoose.connection },
    function(e)
    {
      app.use(cookieParser());
      app.use(passport.initialize());
      app.use(session({
        secret: config.secrets.session,
        resave: true,
        saveUninitialized: true,
        store: sessionStore
      }));
    });

  // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy

  app.use(function(req,res,next){
    next();
  });
  
  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, '/client')));
    app.set('appPath', config.root + '/client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};