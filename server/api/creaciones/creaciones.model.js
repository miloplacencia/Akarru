'use strict';

var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
var User 		= require('../user/user.model');


var Creaciones = new Schema({
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
	coleccion: {
		type: Schema.Types.ObjectId,
		ref: 'Colecciones'
	},
	favoritos: {
		total: Number,
		usuarios: [{
			type: Schema.Types.ObjectId,
			ref: 'Usuarios'
		}]
	},
	vistas: Number,
	fecha_creacion: {
		type: Date,
		default: Date.now
	},
	comentarios: [{
		type: Schema.Types.ObjectId,
		ref: 'Comentarios'
	}],
	generos: []
});

module.exports = mongoose.model('Creaciones',Creaciones);