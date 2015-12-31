'use strict';

angular.module('akarruBackApp')
	.config(function ($stateProvider) {
		$stateProvider
			.state('primerInicio',{
				url				: '/primer-inicio',
				templateUrl		: 'app/dashboard/primerIngreso/primerIngreso.html',
				controller		: 'primerInicioCtrl',
				authenticated	: true
			});
	});