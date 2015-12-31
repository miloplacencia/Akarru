'use strict';

angular.module('akarruBackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('opciones', {
        url: '/opciones',
        templateUrl: 'app/dashboard/opciones/opciones.html',
        controller: 'OpcionesCtrl',
        authenticated: true
      });
  });