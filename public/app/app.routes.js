angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){

	$routeProvider

		.when('/', {
			templateUrl: 'views/pages/dashboard.html',
			controller: 'MainController', // this controller will be used in dashboard.html page
			controllerAs: 'main'          // this is a small-name/nickname for controller
		})
		.when('/login', {
			templateUrl: 'views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'views/pages/signup.html'
		})
		.when('/add_project', {
			templateUrl: 'views/pages/add_project.html'
		})
		.when('/add_issue', {
			templateUrl: 'views/pages/add_issue.html'
		})
		.when('/features', {
			templateUrl: 'views/pages/features.html'
		})
		.when('/pricing', {
			templateUrl: 'views/pages/pricing.html'
		})
		


    //FIXME: its not working
	//$locationProvider.html5Mode(true);	

});