'use strict';

// Production specific configuration
// =================================
// 
var path = require('path');

module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            "127.0.0.1",

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  tmpDir: path.normalize(__dirname + '/../../../public/uploads'),

  // MongoDB connection options
  mongo: {
    uri:    'mongodb://milo:camilo88@ds049160.mongolab.com:49160/akarru' ||
            process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME
  }
};