angular.module("teamService", [])

.factory('Team', function($http) {

    var teamFactory = {};

    teamFactory.invite = function(teamData) {
    	return $http.post('/teams/invite', teamData);	
    };

    teamFactory.myTeam = function() {
    	return $http.get('/teams/my_team');	
    };

    return teamFactory;
});