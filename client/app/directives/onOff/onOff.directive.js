'use strict';

angular.module('akarruBackApp')
	.directive('onOff', [function()
	{
		return {
	  		scope		: {
	  			boolean: '='
	  		},
	  		restrict	: 'E',
	  		templateUrl : 'app/directives/onOff/onOff.html',
	  		replace		: true,
	  		controller	: ['$scope', function($scope)
	  		{
	  			$scope.toggle = function()
	  			{
	  				console.log(this.boolean);
	  			};
	  		}],
	  		link		: function($scope, $e, iAttrs, controller)
	  		{
	  			$e.on('change',function(e)
	  			{
	  				$scope.toggle();
	  			});
	  		}
		};
	}]);