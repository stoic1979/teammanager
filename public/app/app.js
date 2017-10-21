angular.module("myApp", ['appRoutes', 'mainCtrl', 'authService', 'userService', 'userCtrl', 'projectService', 'projectCtrl'])

.config(function($httpProvider) {

    // we need this to push token to our http requests
	$httpProvider.interceptors.push("AuthInterceptor");

});