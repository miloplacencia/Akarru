'use strict';

var express 	= require('express');
var auth 		= require('../../auth/auth.service');
var router 		= express.Router();
var uploads 	= require('./uploads.controller');


router.get(
	'/',
	auth.isAuthenticated(),
	uploads.getUploads
);

router.post(
	'/',
	auth.isAuthenticated(),
	uploads.uploadFile
);

router.post(
	'/avatar',
	auth.isAuthenticated(),
	uploads.uploadAvatar
);
/*
router.get(
	'/:id',
	auth.isAuthenticated(),
	//creaciones.getCreacion
);
router.delete(
	'/:id',
	auth.isAuthenticated(),
	//creaciones.borrarCreacion
);
*/
module.exports = router;
