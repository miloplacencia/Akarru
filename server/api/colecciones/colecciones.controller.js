'use strict';

var Colecciones = require('./colecciones.model');
var Creaciones = require('../creaciones/creaciones.model');
var User    	= require('../user/user.model');
var config  	= require('../../config/environment');
var _       	= require('lodash');
var async   	= require('async');


var validationError = function(res, err)
{
  return res.json(422, err);
};

exports.getColecciones = function(req,res)
{
	Colecciones
		.find({})
		.populate('autor','usuario')
		.populate('creaciones')
		//.populate('comentarios')
		.exec(function(err,colecciones)
		{
			if(err)
				return validationError(res,err);
			res.json(200,colecciones);
		});
};

exports.crearColeccion = function(req,res)
{
	var coleccion = {
		nombre: req.body.nombreColeccion,
		autor: req.user._id,
		generos: req.body.generosColeccion
	};

	var nuevaColeccion = new Colecciones(coleccion);

  	async.waterfall([
  		function(callback)
  		{
  			nuevaColeccion.save(function(err,coleccion)
  			{
  				callback(null,coleccion);
  			});
  		},
  		function(coleccion,callback)
  		{
  			User
  				.findByIdAndUpdate(req.user._id,
  					{
  						$push: { colecciones: coleccion._id }
  					},
		  			function(err,user)
					{
						if(err || !user)
							callback(true);

						callback(null,{ coleccion: coleccion });
					});
  		}
  	],
  	function(er,result)
  	{
	    if(er || _.isEmpty(result.coleccion))
	    	return validationError(res,er);

	   res.json(200,result.coleccion);
  	});
};

exports.getColeccion = function(req,res)
{
	Colecciones
		.findOne({ 
			_id: req.params.id
		})
		.populate('autor','usuario colecciones creaciones')
		.populate('creaciones')
		//.populate('comentarios')
		.exec(function(err,coleccion)
		{
			if(err)
				return validationError(res,err);
			res.json(200,coleccion);
		});
};

exports.borrarColeccion = function(req,res)
{
	async.waterfall([
		function(callback)
		{
			Colecciones
				.findOne({
					$and: [{ autor: req.user._id }, { _id: req.params.id }] 
				},
				function(err,coleccion)
				{
					if(!_.isEmpty(coleccion))
						coleccion.remove(function(err)
						{
							callback(err);
						});
					else
						callback(true);
				});
		},
		function(callback)
		{
			Creaciones
				.update({
					$and: [ { autor: req.user._id }, { coleccion: req.params.id } ]
				},
				{ $set: { coleccion: null } },
				function(err,creacion)
				{
					callback(null);
				});
		},
		function(callback)
		{
			User
				.findOneAndUpdate({
					$and: [ { _id: req.user._id }, { colecciones: req.params.id } ]
				},
				{
					$pull: { colecciones: req.params.id }
				},
				function(err,user)
				{
					if(err || !user)
						callback(true);
					callback(null);
				});
		}
	],
	function(err)
	{
		if(err)
	    	return validationError(res,err);
	    res.send(200);
	});
};

exports.renombrarColeccion = function(req,res)
{
	Colecciones
		.update({
			$and: [{ autor: req.user._id }, { _id: req.params.id }]
		},
		{
			nombre: req.body.nombreColeccion
		},
		function(err)
		{
			if(err)
				return validationError(res,err);
			res.send(200);
		});
};