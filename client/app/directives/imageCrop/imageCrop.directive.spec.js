'use strict';

describe('Directive: imageCrop', function () {

  // load the directive's module
  beforeEach(module('akarruBackApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<image-crop></image-crop>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the imageCrop directive');
  }));
});