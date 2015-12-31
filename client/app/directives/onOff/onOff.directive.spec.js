'use strict';

describe('Directive: onOff', function () {

  // load the directive's module and view
  beforeEach(module('akarruBackApp'));
  beforeEach(module('app/directives/onOff/onOff.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<on-off></on-off>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the onOff directive');
  }));
});