'use strict';

angular.module('akarruBackApp')
  .directive('navbar', function () {
    return {
    	//template: minize and put here
      templateUrl: 'app/directives/navbar/navbar.html',
     	//scope: {}, // {} = isolate, true = child, false/undefined = no change
      controller: ['$scope','$rootScope', '$location', 'Auth', function ($scope, $rootScope, $location, Auth)
      {
        $scope.nav = {
          menu : [{
            'title': 'Inicio',
            'link': '/'
          },
          {
            'title': 'Admin',
            'link': '/admin'
          },
          {
            'title': 'Opciones',
            'link': '/opciones'
          }]
        };
        $scope.nav.logout = function(){
          Auth.logout();
          $location.path('/login');
        }; 
        $scope.nav.isActive = function(route) {
          console.log(route,$location.path(),route===$location.path());
          return route === $location.path();
        };
        $scope.nav.isHome = function() {
          return $scope.is.LoggedIn() ? '/inicio' : '/';
        };

        $scope.is = {
          LoggedIn  : Auth.isLoggedIn,
          Admin     : Auth.isAdmin,
          user      : $rootScope.user
        };

      }],
      restrict: 'E',
      replace: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, iAttrs, controller)
      {

      }
    };
  });