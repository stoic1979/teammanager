angular.module('teamCtrl', ['teamService'])

.controller('TeamController', function(Team){

	var vm = this;

	Team.all()
	.then(function(response){
		console.log("-- got teams: " + JSON.stringify(response));
		vm.teams = response;

	});	

})//TeamController

.controller('TeamCreateController', function(Team, $location, $window){

	var vm = this;

	vm.inviteTeamMember = function() {
		vm.message = '';

		Team.create(vm.teamData)
		.then(function(response){
			vm.teamData = {};
			vm.message = response.data.message;
			$location.path('/invite_team_done');
		})
	};

}) // TeamCreateController
