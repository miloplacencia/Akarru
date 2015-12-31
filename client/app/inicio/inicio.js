'use strict';

angular.module('akarruBackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('inicio', {
        url				: '/inicio',
        templateUrl 	: 'app/inicio/inicio.html',
        controller		: 'InicioCtrl',
        authenticated	: true
      });
  });