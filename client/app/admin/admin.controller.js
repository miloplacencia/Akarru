'use strict';

angular.module('akarruBackApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User, Mensajes, Colecciones,Creaciones,Uploads,$upload) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
    $scope.mensaje = {
      new: '',
      destino: '545454385699072819efbfac',
      enviar: function()
      {
        var self = this;
        Mensajes.save(
          { id: self.destino, mensaje: self.new },
          function(d){
            console.log('guardado!',d);
          });
      },
      borrar: function(id)
      {
        Mensajes.delete(
          { id: id },
          function(d){
            console.log(d);
          });
      }
    };

    $scope.colecciones = {
      nombre: '',
      list: []
    };

    $scope.colecciones.crear = function()
    {
      var self = this;
      Colecciones
        .save({
          nombreColeccion: self.nombre
        },
        function(d)
        {
          self.list.push(d);
          self.nombre = '';
          console.log(d,'creado!');
        });
    };
    $scope.colecciones.borrar = function(coleccion)
    {
      var self = this;
      Colecciones.delete({id:coleccion._id},function(d){
        console.log(d,'eliminado!');
        self.list = _.difference(self.list,[coleccion]);
      });
    };

    $scope.creaciones = {
      nombre: '',
      tags: ['pruebita','imagen','esto es una prea'],
      list: [],
      coleccion: '',
    };
    $scope.creaciones.crear = function()
    {
      var self = this;
      Creaciones.save({
        nombreCreacion: self.nombre,
        generosCreacion: self.tags,
        idColeccion: self.coleccion
      },
      function(d)
      {
        self.list.push(d);
        self.nombre = '';
        console.log(d,'creado!');
      });
    };
    $scope.creaciones.borrar = function(creacion)
    {
      var self = this;
      Creaciones.delete({ id:creacion._id },function(d)
      {
        console.log(d,'eliminado!');
        self.list = _.difference(self.list,[creacion]);
      });
    };

    $scope.image = {
      url: ''
    };

    $scope.onFileSelect = function($files)
    {
      //var self = this;
      /*
      var file = $files[0];

      console.log(file);

      $scope.upload = $upload.upload({
        url: 'api/upload',
        method: 'POST',
        file: file
      })
      .progress(function(e)
      {
        console.log(e);
      })
      .success(function(data)
      {
        $scope.image.url = data.tempFile.split('client\\')[1];
      });
      */
    };

    Colecciones.query().$promise.then(function(colecciones){
      $scope.colecciones.list = colecciones;
    });

    Creaciones.query().$promise.then(function(creaciones){
      $scope.creaciones.list = creaciones;
    });

    Mensajes.query().$promise.then(function(mensajes){
      $scope.mensajes = mensajes;
    });

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.cambioRol = function(user)
    {
      console.log(user._id);
      User.cambioRol({
        _id: user._id,
        role: user.role
      });
    };
  });
