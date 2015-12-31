'use strict';

// Development specific configuration
// ==================================
var path = require('path');

module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://milo:camilo88@ds049160.mongolab.com:49160/akarru'
  },

  tmpDir: path.normalize(__dirname + '/../../../client/uploads'),

  seedDB: true
};
