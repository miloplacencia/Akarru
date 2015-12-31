'use strict';

angular.module('akarruBackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('ingreso', {
        url: '/ingreso',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('registro', {
        url: '/registro',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      });
  });