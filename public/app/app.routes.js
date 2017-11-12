angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){

	$routeProvider

		.when('/', {
			templateUrl: 'views/general/dashboard.html',
			controller: 'MainController', // this controller will be used in dashboard.html page
			controllerAs: 'main'          // this is a small-name/nickname for controller
		})
		.when('/login', {
			templateUrl: 'views/general/login.html'
		})
		.when('/signup', {
			templateUrl: 'views/general/signup.html'
		})
		.when('/add_project', {
			templateUrl: 'views/general/add_project.html',
			controller: 'ProjectController',
		})
		.when('/add_issue', {
			templateUrl: 'views/general/add_issue.html'
		})
		.when('/features', {
			templateUrl: 'views/general/features.html'
		})
		.when('/pricing', {
			templateUrl: 'views/general/pricing.html'
		})
		.when('/my_team', {
			templateUrl: 'views/general/my_team.html',
			controller: 'TeamController'
		})
		.when('/reports', {
			templateUrl: 'views/general/reports.html'
		})
		.when('/profile', {
			templateUrl: 'views/general/profile.html'
		})
		.when('/about_us', {
			templateUrl: 'views/general/about_us.html'
		})
		.when('/messages', {
			templateUrl: 'views/general/messages.html'
		})
		.when('/backlogs', {
			templateUrl: 'views/general/backlogs.html'
		})
		.when('/contact_us', {
			templateUrl: 'views/general/contact_us.html'
		})
		.when('/signup_done', {
			templateUrl: 'views/general/signup_done.html'
		})
		.when('/projects', {
			templateUrl: 'views/general/projects.html',
			controller: 'MainController',
			controllerAs: 'main' 
		})
		.when('/project_info', {
			templateUrl: 'views/general/project_info.html',
			controller: 'IssueController',
			controllerAs: 'issue'
		})
		.otherwise({
      		templateUrl: 'views/general/404.html'
    	});

    //FIXME: its not working
	//$locationProvider.html5Mode(true);	

});