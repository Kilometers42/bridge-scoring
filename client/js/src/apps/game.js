angular.module('game', ['ngRoute','ngResource','game.controllers', 'game.directives', 'game.services'])
.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : '/client/views/home.ejs',
				
			})

			// route for the about page
			.when('/Results', {
				templateUrl : '/client/views/results.ejs',
				controller  : 'game.controller.tab'
			})

			//route for the contact page
			.when('/About', {
				templateUrl : '/client/views/about.ejs',
			})
			.when('/Login', {
				templateUrl : '/client/views/login.ejs',
			});
	});