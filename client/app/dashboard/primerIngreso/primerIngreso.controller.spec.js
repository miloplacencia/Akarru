'use strict';

describe('Controller: PrimeringresoCtrl', function () {

  // load the controller's module
  beforeEach(module('akarruBackApp'));

  var PrimeringresoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrimeringresoCtrl = $controller('PrimeringresoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
