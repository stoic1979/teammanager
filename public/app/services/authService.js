angular.module("authService", [])

.factory('Auth', function($http, $q, AuthToken) {

    var authFactory = {};

    //-------------------------------------------------
    //             LOGIN
    //-------------------------------------------------
    authFactory.login = function(username, password) {

     	return $http.post('/api/login', {
     		username: username,
     		password: password
     	})
     	.then(function(response){
     		 console.log("authFactory.login() got data: " + JSON.stringify(response.data) );
             AuthToken.setToken(response.data.token);
             return data;
     	})
     	.catch(function(data){

     	});

     	

    };//login

    //-------------------------------------------------
    //             LOGOUT
    //-------------------------------------------------
    authFactory.logout = function() {
        AuthToken.setToken();
    };//logout

    //-------------------------------------------------
    //           IS LOGGED IN
    //-------------------------------------------------
    authFactory.isLoggedIn = function() {
        if(AuthToken.getToken()) return true;
        return false;
    };//isLoggedIn

    //-------------------------------------------------
    //           GET USER
    //-------------------------------------------------
	authFactory.getUser = function() {
        if(AuthToken.getToken()) {
        	return $http.get("/api/me", 
        		{headers: {'x-access-token': AuthToken.getToken()}}
        	);
        } else {
        	return $q.reject({message: "User does not have a token!"});
        }
    };//getUser

    return authFactory;


})//authFactory

.factory('AuthToken', function($window){ 

	var authTokenFactory = {};


	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};
   
    authTokenFactory.setToken = function(token) {
    	if(token) {
			$window.localStorage.setItem('token', token);
	    } else {
	    	$window.localStorage.removeItem('token');
	    }
	};

	return authTokenFactory;

})//authTokenFactory

.factory('AuthInterceptor', function($q, $location, AuthToken){

	var interceptorFactory = {};


	interceptorFactory.request = function(config) {
		var token = AuthToken.getToken();

		if(token) {
			config.headers['x-access-token'] = token;
		}

		return config;
	};

	interceptorFactory.responseError = function(response) {
		var token = AuthToken.getToken();

		if(response.status == 403) {
			$location.path('/login');
		}

		return $q.reject(response);
	};

	return interceptorFactory;

});// AuthInterceptor