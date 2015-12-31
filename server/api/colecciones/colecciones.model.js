'use strict';

var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
var User 		= require('../user/user.model');

var Colecciones = new Schema({
	nombre: String,
	imagenes: {
		full: String,
		preview: String,
		thumbnail: String
	},
	autor: {
		type: Schema.Types.ObjectId,
		ref: 'Usuarios'
	},
	creaciones: [{
		type: Schema.Types.ObjectId,
		ref: 'Creaciones'
	}],
	followers: [{
		type: Schema.Types.ObjectId,
		ref: 'Usuarios'
	}],
	popularidad: Number,
	vistas: Number,
	fecha_creacion: {
		type: Date,
		default: Date.now
	},
	fecha_actualizacion: Date,
	comentarios: [{
		type: Schema.Types.ObjectId,
		ref: 'Comentarios'
	}],
	generos: []
});


module.exports = mongoose.model('Colecciones',Colecciones);