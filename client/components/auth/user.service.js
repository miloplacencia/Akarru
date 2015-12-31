'use strict';

angular.module('akarruBackApp')
  .factory('User', function ($resource)
  {
    return $resource('/api/user/:id/:controller/:attrs',{ 
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      cambioRol : {
        method: 'PUT',
        params: {
          controller: 'rol',
          attrs: '@role'
        }
      },
      enviarMensaje : {
        method: 'PUT',
        params: {
          controller: 'mensaje'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      actualizar: {
        method: 'PUT'
      }
	  });
  });

angular.module('akarruBackApp')
  .factory('Mensajes', function ($resource){
    return $resource('/api/mensajes/:id',{
      id: '@_id'
    });
  });

angular.module('akarruBackApp')
  .factory('Colecciones', function ($resource){
    return $resource('/api/colecciones/:id',{
      id: '@_id'
    });
  });

angular.module('akarruBackApp')
  .factory('Creaciones', function ($resource){
    return $resource('/api/creaciones/:id',{
      id: '@_id'
    });
  });

angular.module('akarruBackApp')
  .factory('Uploads', function ($resource){
    return $resource('/api/upload/:id',{
      id: '@_id'
    });
  });