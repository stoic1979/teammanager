//--------------------------------------------------
// 
//--------------------------------------------------

var dependencies = [
	'appRoutes', 
	'mainCtrl', 
	'authService', 
	'userService', 
	'userCtrl', 
	'teamCtrl',
	'teamService',
	'projectService', 
	'projectCtrl',
	'issueService', 
	'issueCtrl'
	];

angular.module("myApp", dependencies)

.config(function($httpProvider) {

    // we need this to push token to our http requests
	$httpProvider.interceptors.push("AuthInterceptor");

});