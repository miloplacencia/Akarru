'use strict';

describe('Controller: InicioCtrl', function () {

  // load the controller's module
  beforeEach(module('akarruBackApp'));

  var InicioCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InicioCtrl = $controller('InicioCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
