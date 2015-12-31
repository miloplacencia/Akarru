'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  usuario: String,
  email: { type: String, lowercase: true },
  perfil: {
    primerLogin: { type: Boolean, default: true },
    mostrarEmail: { type: Boolean, default: false },
    ubicacion: String,
    sobreMi: String,
    filtroNSFW: { type: Boolean, default: true },
    avatar: String,
    links: [{
      nombre: String,
      link: String
    }]
  },
  role: {
    type: String,
    default: 'usuario' //usuario,administrador
  },
  hashedPassword: String,
  salt: String,
  fecha_nacimiento: Date,
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  following: [{
    type: Schema.Types.ObjectId,
    ref : 'Usuarios'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref : 'Usuarios'
  }],
  grupos: [],
  creaciones: [{
    type: Schema.Types.ObjectId,
    ref: 'Creaciones'
  }],
  colecciones: [{
    type: Schema.Types.ObjectId,
    ref: 'Colecciones'
  }],
  mensajes: {
    enviados: {
      type: Number,
      default: 0
    },
    recibidos: {
      type: Number,
      default: 0
    },
    id_mensajes: [{
      type: Schema.Types.ObjectId,
      ref: 'Mensajes'
    }]
  },
  favoritos: [],
  provider: String,
  facebook: {},
  twitter: {},
  google: {},
  imagenes: {
    perfil: String
  }
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function(){
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'usuario': this.usuario,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function()
  {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'El email no puede estar en blanco');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'La contraseña no puede estar en blanco');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond)
  {
    var self = this;
    this.constructor.findOne(
      {email: value},
      function(err, user)
      {
        if(err) 
          throw err;
        if(user)
        {
          if(self.id === user.id) return respond(true);
          return respond(false);
        }
        respond(true);
    });
  }, 'El email que ingresaste ya esta en uso');

var validatePresenceOf = function(value)
{
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next)
  {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Contraseña Invalida'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText)
  {
    return this.hashedPassword === this.encryptPassword(plainText);
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function()
  {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password)
  {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('Usuarios', UserSchema);
