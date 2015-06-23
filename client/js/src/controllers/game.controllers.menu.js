angular.module('game.controllers')
.controller('game.controller.menu', function($scope, $location) {
    $scope.isActive = function(route) {
        return route === $location.path();
    };
    $scope.test = true;
});