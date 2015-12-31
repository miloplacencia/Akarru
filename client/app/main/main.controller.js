'use strict';

angular.module('akarruBackApp')
  .controller('MainCtrl', ['Auth','$scope', '$http', 'socket', 'User', '$location', function (Auth, $scope, $http, socket, User, $location)
  {
      
    $scope.isActive = function(route)
    {
      return route === $location.path();
    };

/*
    $scope.awesomeThings = [];
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    User.get().$promise.then(function(u)
    {
      if(u._id)
      {
        socket.sendUser(u._id);
      }
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
*/

    $scope.registro = {
      enviado : false,
      user    : {},
      errores : {}
    };

    $scope.registro.enviar = function(form)
    {
      var self = this;
      this.enviado = true;

      if(form.$valid)
      {
        Auth.createUser(this.user)
        .then( function()
        {
          $location.path('/inicio');
        })
        .catch( function(err)
        {
          err = err.data;
          self.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field)
          {
            form[field].$setValidity('mongoose', false);
            self.errors[field] = error.message;
          });
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

  }]);
