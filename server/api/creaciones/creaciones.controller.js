'use strict';

var Creaciones 	= require('./creaciones.model');
var Colecciones = require('../colecciones/colecciones.model');
var User    	= require('../user/user.model');
var config  	= require('../../config/environment');
var _       	= require('lodash');
var async   	= require('async');


var validationError = function(res, err)
{
  return res.json(422, err);
};

exports.getCreaciones = function(req,res)
{
	Creaciones
		.find({})
		.populate('autor','usuario')
		.populate('coleccion','nombre')
		//.populate('comentarios')
		.exec(function(err,creaciones)
		{
			if(err)
				return validationError(res,err);
			res.json(200,creaciones);
		});
};

exports.crearCreacion = function(req,res)
{
	var creacion = {
		nombre: req.body.nombreCreacion,
		autor: req.user._id,
		generos: req.body.generosCreacion,
		coleccion: req.body.idColeccion || null
	};

	var nuevaCreacion = new Creaciones(creacion);

  	async.waterfall([
  		function(callback)
  		{
  			nuevaCreacion
  				.save(function(err,creacion)
	  			{
	  				callback(null,creacion);
	  			});
  		},
  		function(creacion,callback)
  		{
  			if(!!req.body.idColeccion)
	  			Colecciones
	  				.findByIdAndUpdate(creacion.coleccion,
	  					{ $push: { creaciones: creacion._id } },
	  					function(err,coleccion)
			  			{
			  				if(err || !coleccion)
			  					callback(true);
			  				callback(null,{ creacion: creacion });
			  			});
		  	else
		  		callback(null,{ creacion: creacion });
  		},
  		function(results,callback)
  		{
  			User
  				.findByIdAndUpdate(req.user._id,
  					{ $push: { creaciones: results.creacion._id } },
  					function(err,user)
					{
						console.log(err,user);

						if(err || !user)
							callback(true);
						callback(null,results);
					});
  		}
  	],
  	function(er,result)
  	{
	   if(er || _.isEmpty(result.creacion))
	   	return validationError(res,er);

   	res.json(200,result.creacion);
  	});
};

exports.addColeccionToCreacion = function(req,res)
{
	async.waterfall([
		function(callback)
		{
			Creaciones.update({
				$and: [{ _id: req.params.id },{ autor: req.user._id }]
			},
			{ coleccion: req.body.idColeccion },
			function(err,creacion)
			{
				if(err || !creacion)
					callback(true);

				callback(null);
			});
		},
		function(callback)
		{
			Colecciones.findOneAndUpdate({
				$and: [{ _id: req.params.idColeccion },{ autor: req.user._id }]
			},
			{
				$push: { creaciones: req.params.id }
			},
			function(err,coleccion)
			{
				if(err || !coleccion)
					callback(true);

				callback(null);
			});
		},
	],
	function(err,coleccion)
	{
		if(err)
	   	return validationError(res,err);

	   res.send(200);
	});
};

exports.removeColeccionFromCreacion = function(req,res)
{
	async.waterfall([
		function(callback)
		{
			Creaciones.update({
				$and: [{ _id: req.params.id },{ autor: req.user._id }]
			},
			{ coleccion: null },
			function(err,creacion)
			{
				if(err || !creacion)
					callback(true);

				callback(null);
			});
		},
		function(callback)
		{
			Colecciones.update({
				$and: [{ _id: req.params.idColeccion },{ autor: req.user._id }]
			},
			{
				$pull: { creaciones: req.params.id }
			},
			function(err,coleccion)
			{
				if(err || !coleccion)
					callback(true);

				callback(null);
			});
		},
	],
	function(err)
	{
		if(err)
	   	return validationError(res,err);

	   res.send(200);
	});
};

exports.getCreacion = function(req,res)
{
	Creaciones
		.find({ 
			_id: req.params.id
		})
		.populate('autor','usuario creaciones colecciones')
		.populate('creacion')
		//.populate('comentarios')
		.exec(function(err,creacion)
		{
			if(err)
				return validationError(res,err);
			res.json(200,creacion);
		});
};

exports.borrarCreacion = function(req,res)
{
	async.waterfall([
		function(callback)
		{
			Creaciones
				.findOneAndRemove({
					$and: [{ autor: req.user._id }, { _id: req.params.id }]
				},
				function(err,creacion)
				{
					if(err || !creacion)
						callback(true);
					callback(null);
				});
		},
		function(callback)
		{
			Colecciones
				.update({
					$and: [{ autor: req.user._id }, { creaciones: req.params.id }]
				},
				{
					$pull: { creaciones: req.params.id }
				},
				function(err,coleccion)
				{
					if(err || !coleccion)
						callback(true);

					callback(null);
				});
		},
		function(callback)
		{
			User
				.update({
					$and: [{ _id: req.user._id }, { creaciones: req.params.id }]
				},
				{
					$pull: { creaciones: req.params.id }
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

exports.renombrarCreacion = function(req,res)
{
	Creaciones
		.update({
			$and: [{ autor: req.user._id }, { _id: req.params.id }]
		},
		{
			nombre: req.body.nombreCreacion
		},
		function(err)
		{
			if(err)
				return validationError(res,err);
			res.send(200);
		});
};