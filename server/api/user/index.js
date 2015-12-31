'use strict';

var express 	= require('express');
var controller 	= require('./user.controller');
var config 		= require('../../config/environment');
var auth 		= require('../../auth/auth.service');
var router 		= express.Router();

router.get(
	'/', 
	auth.hasRole('administrador'), 
	controller.index
);

//borrar usuario
router.delete(
	'/:id', 
	auth.hasRole('administrador'), 
	controller.destroy
);
//obtener usuario actual
router.get(
	'/me', 
	auth.isAuthenticated(), 
	controller.me
);

//actualizar user
router.put(
	'/:id', 
	auth.isAuthenticated(), 
	controller.updateUser
);

//actualizar pass
router.put(
	'/:id/password', 
	auth.isAuthenticated(), 
	controller.changePassword
);

//actualizar rol
router.put(
	'/:id/rol/:rol',
	auth.hasRole('administrador'),
	controller.cambiarTipoUser
);
//mostrar usuario
router.get(
	'/:id', 
	auth.isAuthenticated(), 
	controller.show
);

//crear usuario
router.post(
	'/',
	controller.create
);




module.exports = router;
