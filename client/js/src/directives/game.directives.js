angular.module('game.directives', [])
.directive('compileTab', function ($compile) {
    return {
      link: function (scope, element) {
        $compile(element.contents())(scope);
      }
    };
  })