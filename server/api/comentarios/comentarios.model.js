'use strict';

var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
var User 		= require('../user/user.model');


var Comentarios = new Schema({
	tipo: String,//tipos: Creacion, Coleccion, Usuario (mensaje en perfil)
	id_padre: String, //Define el id de donde esta ubicado el mensaje (Creacion, Coleccion, etc)
	creado_en: {
		type: Date,
		default: Date.now
	},
	autor: {
		type: String,
		ref: 'Usuarios'
	},
	mensaje: {
		texto: String,
		ediciones: [{
			mensaje: String,
			fecha_modificacion: Date
		}]
	}
});

module.exports = mongoose.model('Comentarios',Comentarios);