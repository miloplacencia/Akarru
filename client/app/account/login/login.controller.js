'use strict';

angular.module('akarruBackApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window /*,User*/)
  {
    $scope.login = {
      enviado : false,
      user    : {},
      errors  : {}
    };

    $scope.login.enviar = function(form)
    {
      var self = this;
      this.enviado = true;

      if(form.$valid)
      {
        Auth.login({
          email: self.user.email,
          password: self.user.password
        })
        .then(function() 
        {
          $location.path('/inicio');
        })
        .catch( function(err)
        {
          console.log('not valid ',err);
          self.errors.other = err.message;
        });
      }
    };
    $scope.login.oauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
