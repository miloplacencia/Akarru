'use strict';

describe('Controller: OpcionesCtrl', function () {

  // load the controller's module
  beforeEach(module('akarruBackApp'));

  var OpcionesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OpcionesCtrl = $controller('OpcionesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
