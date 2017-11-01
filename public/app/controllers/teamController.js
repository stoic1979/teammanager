angular.module('teamCtrl', ['teamService'])

.controller('TeamController', function(Team, $location, $window){

	var vm = this;

	vm.inviteTeamMember = function() {
		vm.message = '';

		console.log("-- invite team members --");

		Team.invite(vm.teamData)
		.then(function(response){
			vm.teamData = {};
			vm.message = response.data.message;

			console.log("response: " + JSON.stringify(response));

			//$location.path('/invite_team_done');
		})
	};

}) // TeamCreateController
