'use strict';

angular.module('akarruBackApp')
	.controller('InicioCtrl', ['$scope','$rootScope',function ($scope,$rootScope)
	{
		$scope.inicio = {
			user: $rootScope.user
		};
	}]);
