'use strict';

var express 	= require('express');
var controller 	= require('./mensajes.controller');
var config 		= require('../../config/environment');
var auth 		= require('../../auth/auth.service');
var router 		= express.Router();

router.get(
	'/',
	auth.isAuthenticated(),
	controller.getMensajes
);
router.get(
	'/:id',
	auth.isAuthenticated(),
	controller.getMensaje
);
router.post(
	'/',
	auth.isAuthenticated(),
	controller.crearMensaje
);
router.delete(
	'/:id',
	auth.isAuthenticated(),
	controller.borrarMensaje
);




module.exports = router;