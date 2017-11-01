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
			templateUrl: 'views/pages/add_project.html',
			controller: 'ProjectController',
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
		.when('/my_team', {
			templateUrl: 'views/pages/my_team.html',
			controller: 'TeamController'
		})
		.when('/reports', {
			templateUrl: 'views/pages/reports.html'
		})
		.when('/profile', {
			templateUrl: 'views/pages/profile.html'
		})
		.when('/contact_us', {
			templateUrl: 'views/pages/contact_us.html'
		})
		.when('/signup_done', {
			templateUrl: 'views/pages/signup_done.html'
		})
		


    //FIXME: its not working
	//$locationProvider.html5Mode(true);	

});