'use strict';

var express 	= require('express');
var auth 		= require('../../auth/auth.service');
var router 		= express.Router();
var colecciones = require('./colecciones.controller');

router.get(
	'/',
	auth.isAuthenticated(),
	colecciones.getColecciones
);
router.get(
	'/:id',
	auth.isAuthenticated(),
	colecciones.getColeccion
);
router.post(
	'/',
	auth.isAuthenticated(),
	colecciones.crearColeccion
);
router.delete(
	'/:id',
	auth.isAuthenticated(),
	colecciones.borrarColeccion
);
router.put(
	'/:id',
	auth.isAuthenticated(),
	colecciones.renombrarColeccion
);



module.exports = router;