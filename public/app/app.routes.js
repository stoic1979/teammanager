angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){

	$routeProvider

		.when('/', {
			templateUrl: 'views/pages/home.html',
			controller: 'MainController', // this controller will be used in home.html page
			controllerAs: 'main'          // this is a small-name/nickname for controller
		})
		.when('/login', {
			templateUrl: 'views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'views/pages/signup.html'
		})
		


    //FIXME: its not working
	//$locationProvider.html5Mode(true);	

});