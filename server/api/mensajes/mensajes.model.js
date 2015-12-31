'use strict';

var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
var Usuario 	= require('../user/user.model');

var MensajesSchema = new Schema({
	de: {
		type: String,
		ref: 'Usuarios'
	},
	para: [{
		type: Schema.Types.ObjectId,
		ref: 'Usuarios'
	}],
	asunto: String,
	mensaje: String,
	fecha_envio: {
		type: Date,
		default: Date.now
	},
	fecha_lectura: Date
});


module.exports = mongoose.model('Mensajes', MensajesSchema);

