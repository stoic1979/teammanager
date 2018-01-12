angular.module("userService", [])

.factory('User', function($http, AuthToken) {

    var userFactory = {};


    userFactory.create = function(userData) {
    	return $http.post('/users/signup', userData);	
    };

    userFactory.all = function() {
    	var payload = {
    			headers: {'x-access-token': AuthToken.getToken()}
    		};
    	return $http.get('/users/all',payload);	
    };



    return userFactory;
});