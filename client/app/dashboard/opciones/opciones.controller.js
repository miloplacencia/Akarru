'use strict';

angular.module('akarruBackApp')
	.controller('OpcionesCtrl', ['$scope','$rootScope','Auth', function($scope,$rootScope,Auth) 
	{
		$scope.opciones = {};
		$scope.opciones.user = $rootScope.user;
			var social = ['facebook','twitter','tumblr'];

		if( $scope.opciones.user.perfil.links.length !== 3 )	
			for(var i=0,len=social.length;i<len;i++)
			{
				if(!_.isObject($scope.opciones.user.perfil.links[i]))
				{
					$scope.opciones.user.perfil.links[i] = {};
					$scope.opciones.user.perfil.links[i].nombre = social[i];
				}
			}

		$scope.opciones.actualizar = function()
		{
			var self = this;
			Auth.actualizar({ id: self.user._id }, self.user);
			$rootScope.user = self.user;
			$rootScope.$emit('userchange',self.user);
		};
	}]);
