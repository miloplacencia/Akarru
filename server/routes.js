/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app){

  // Insert routes below
  var routeList = [
    'thing',
    'user',
    'mensajes',
    'colecciones',
    'creaciones',
    'upload'
  ];

  routeList.forEach(function(route){
    app.use('/api/'+route, require('./api/'+route));
  });

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });

  console.log(app.get('appPath'));
};
