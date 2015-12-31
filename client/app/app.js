'use strict';

angular.module('akarruBackApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'angularFileUpload',
  'angular-loading-bar'
])
  .config(['$urlRouterProvider', '$locationProvider', '$httpProvider', function ($urlP, $locationP, $httpP)
  {
    $urlP.otherwise('/');
    $locationP.html5Mode(true);
    $httpP.interceptors.push('authInterceptor');
  }])
  .factory('authInterceptor',['$q', '$cookieStore', '$location', function ($q, $cookieStore, $location)
  {
    return {
      // Add authorization token to headers
      request: function (config)
      {
        config.headers = config.headers || {};
        if ($cookieStore.get('token'))
        {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response)
      {
        if(response.status === 401)
        {
          $location.path('/ingreso');
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else
        {
          return $q.reject(response);
        }
      }
    };
  }])
  .run(['$rootScope', '$state', '$location', 'Auth',function ($rootScope, $state, $location, Auth)
  {
    $rootScope.$on('$stateChangeStart', function (event, next,nextParams,prev,prevParams)
    {
      event.preventDefault();

      Auth.isLoggedInAsync(function(loggedIn)
      {
        var hacia = (!!next.authenticated && loggedIn || !next.authenticated && !loggedIn) ? next.name : (!next.authenticated && loggedIn) ? 'inicio' : 'ingreso';

        if(loggedIn && (!$rootScope.user || !_.isEmpty($rootScope.user)))
          $rootScope.user = Auth.getCurrentUser();
        else if(!loggedIn)
          $rootScope.user = null;

        $state.go(hacia,nextParams,{ notify: false }).then(function()
        {
          $rootScope.$broadcast('$stateChangeSuccess',hacia,nextParams,prev,prevParams);
        });
      });
    });
  }]);