'use strict';

angular.module('akarruBackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url 				: '/admin',
        templateUrl 		: 'app/admin/admin.html',
        controller 		: 'AdminCtrl',
        authenticated	: true
      });
  });