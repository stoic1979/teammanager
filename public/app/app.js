angular.module("myApp", ['appRoutes', 'mainCtrl', 'authService', 'userService', 'userCtrl', 'storyService', 'storyCtrl'])

.config(function($httpProvider) {

    // we need this to push token to our http requests
	$httpProvider.interceptors.push("AuthInterceptor");

});