angular.module("teamService", [])

.factory('Team', function($http, $q, AuthToken) {

    var teamFactory = {};

    teamFactory.all = function(teamData) {
    	return $http.post('/teams/', teamData);	//FIXME - do it later...
    };

    teamFactory.invite = function(teamData) {

    	var payload = {
    			email: 		teamData.email,
    			headers: 	{'x-access-token': AuthToken.getToken()}
    		}; 

    	return $http.post('/users/invite_team_member', payload);	
    };

    return teamFactory;
});