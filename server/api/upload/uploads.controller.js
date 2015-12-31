'use strict';

//var Uploads 	= require('./creaciones.model');
//var Colecciones = require('../colecciones/colecciones.model');
var User    	= require('../user/user.model');
var config  	= require('../../config/environment');
var _       	= require('lodash');
var async   	= require('async');
var fs 			= require('fs-extra');
var path        = require('path');
var multipart   = require('multiparty');
var gm 			= require('gm');
var sizeOf 		= require('image-size');

var validationError = function(res, err)
{
  return res.json(422, err);
};

exports.getUploads = function(req,res)
{
	/*
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
	*/
};

var subirImagen = function(options)
{
	return function(req,res,next)
	{
		var form = new multipart.Form({
			autoFiles: true,
			uploadDir: path.join(config.tmpDir,'tmp/')
		});

		var imageProperties = {};
		
		form.on('error',function(err)
		{
			return validationError(res,err);
		});

		form.on('field',function(name,value)
		{
			imageProperties = JSON.parse(value);
		});

		form.on('file',function(name,file)
		{
			if(file.size/1024 < options.maxFileSize && file.headers['content-type'].match(/^image\/\w+/ig))
			{
				form.on('close',function()
				{
					var originalTmp 	= file.path;
					var extension 		= file.originalFilename.split('.');
					var ext 				= extension[extension.length-1];
					var nombreArchivo = options.outputFolder + req.user._id +options.image.sufix + '.' + options.outputType;//+ext;
					var finalArchivo	= path.join(config.tmpDir,nombreArchivo);
					
					var gmTemp = gm(originalTmp);

					if(!!imageProperties.iHeight && !!imageProperties.iWidth && !!options.image.oWidth && !!options.image.oHeight)
					{
						var sizeX 	= ~~(imageProperties.iWidth * imageProperties.ratio);
						var sizeY 	= ~~(imageProperties.iHeight * imageProperties.ratio);
						var posX 	= ~~(imageProperties.posX * imageProperties.ratio);
						var posY 	= ~~(imageProperties.posY * imageProperties.ratio);

						gmTemp
							.crop(sizeX,sizeY,posX,posY)
							.resize(options.image.oWidth,options.image.oHeight)
							.background('#FFFFFF')
							.extent(options.image.oWidth,options.image.oHeight);
					}

					var callbacker = (_.isFunction(options.callback)) ? options.callback : function(callback) { callback(null); };

					async.waterfall([
						function(callback)
						{
							gmTemp
								.quality(options.image.quality)
								.compress('LZMA')
								.write(finalArchivo,function(err)
								{
									if(err)
										callback(err);
									else
										callback(null);
								});
						},
						function(callback)
						{
							fs.unlink(originalTmp,function(er)
							{
								if(er)
									callback(er)
								else
									callback(null);

									
							});
						},
						callbacker(req,res,finalArchivo)
					],
					function(error,result)
					{
						if(error)
							return validationError(res,error);
						else
							res.json(200,{
								user: result
							});	
					});
				});
			}
			else
			{
				fs.unlink(file.path,function(er)
				{
					if(er)
						return validationError(res,er);

					res.json(422,{
						'Error': 'Archivo demasiado grande'
					});		
				});
			}
		});

		form.parse(req);
	}
};


exports.uploadAvatar = subirImagen({
	maxFileSize : 1000,//in KB, 1MB
	outputType 	: 'jpg',
	outputFolder: 'tmp/',
	image: {
		oWidth 	: 200,
		oHeight : 200,
		quality : 90,
		sufix  	: '_av'
	},
	callback: function(req,res,url)
	{
		return function(callback)
		{
			User.findById(
				req.user._id,
				'perfil',
				function(err,user)
				{
					if(err)
						callback(err)
					else
					{
						user.perfil.avatar = url.split('client')[1].replace(/\\/g,'/');
						user.save(function(e,u)
						{
							if(e)
								callback(e);
							else
								callback(null,u);
						});
					}
				});
		};
	}
});

exports.uploadFile = subirImagen({
	maxFileSize: 1000,//in KB, 1MB
	outputType: 'jpg',
	outputFolder: 'tmp/',
	image: {
		quality : 90,
		sufix 	: '_h'
	}	
});