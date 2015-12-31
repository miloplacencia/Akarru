'use strict';

angular.module('akarruBackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url 			: '/',
        templateUrl 	: 'app/main/main.html',
        controller 	: 'MainCtrl'
      });
  });