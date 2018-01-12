angular.module("teamService", [])

.factory('Team', function($http, $q, AuthToken) {

    var teamFactory = {};

    teamFactory.all = function(teamData) {
        var payload = {
                headers: {'x-access-token': AuthToken.getToken()}
            };
    	return $http.get('/members/all', payload);	
    };

    teamFactory.invite = function(teamData) {

    	var payload = {
    			email: 		teamData.email,
    			headers: 	{'x-access-token': AuthToken.getToken()}
    		}; 

    	return $http.post('/members/invite_team_member', payload);	
    };

    return teamFactory;
});