'use strict';

var Mensaje = require('./mensajes.model');
var User    = require('../user/user.model');
var _       = require('lodash');
var async   = require('async');


var validationError = function(res, err)
{
  return res.json(422, err);
};

exports.getMensajes = function(req,res)
{
	Mensaje
		.find({ $or:[{de: req.user._id},{ para: req.user._id }] })
		.populate('de','usuario')
		.populate('para','usuario')
		.exec(function(err,mensajes)
		{
			if(err)
				return validationError(res,err);
			res.json(200,mensajes);
		});
};

exports.crearMensaje = function(req,res)
{
	var mensaje = {
		de: req.user._id,
		para: [req.body.id],
		mensaje: req.body.mensaje
	};

	var nuevoMensaje = new Mensaje(mensaje);

	var envio = {
		recibidos: req.body.id,
    	enviados: req.user._id
	};

	var serializer = function(recibiendo)
	{
	    return function(callback)
	    {
	      	var recibeOenvia = (!!recibiendo) ? 'recibidos' : 'enviados';
	      
	      	User.findById(envio[recibeOenvia],function(err,user)
			{
				user.mensajes[recibeOenvia] += 1;
				user.save(function(err)
				{
					callback(null,'recibo');
		        });
			});
	    };
	};

  	async.series([
  		function(callback)
  		{
  			nuevoMensaje.save(function(err,mensaje)
			{
				callback(err,'mensaje');
			});
  		},
		serializer(true),
		serializer()
  	],
  	function(er,result)
  	{
	    if(er)
	      return validationError(res,er);
	  	console.log(result,er);
	    if(!!result[0] && !!result[1] && !!result[2])
	      res.send(200);
  	});
};

exports.getMensaje = function(req,res)
{

};

exports.borrarMensaje = function(req,res)
{
	console.log(req.params.id);
};
