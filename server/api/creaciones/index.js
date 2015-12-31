'use strict';

var express 	= require('express');
var auth 		= require('../../auth/auth.service');
var router 		= express.Router();
var creaciones 	= require('./creaciones.controller');

router.get(
	'/',
	auth.isAuthenticated(),
	creaciones.getCreaciones
);
router.get(
	'/:id',
	auth.isAuthenticated(),
	creaciones.getCreacion
);
router.post(
	'/',
	auth.isAuthenticated(),
	creaciones.crearCreacion
);
router.put(
	'/addTo/:id',
	auth.isAuthenticated(),
	creaciones.addColeccionToCreacion
);
router.put(
	'/sacarDe/:id',
	auth.isAuthenticated(),
	creaciones.removeColeccionFromCreacion
);
router.delete(
	'/:id',
	auth.isAuthenticated(),
	creaciones.borrarCreacion
);

module.exports = router;