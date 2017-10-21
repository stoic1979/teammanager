angular.module("userService", [])

.factory('User', function($http) {

    var userFactory = {};


    userFactory.create = function(userData) {
    	return $http.post('/users/signup', userData);	
    };

    userFactory.all = function() {
    	return $http.get('/api/users');	
    };



    return userFactory;
});