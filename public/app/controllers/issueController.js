angular.module('issueCtrl', ['issueService'])

.controller('IssueController', function($rootScope, Issue, $location, $window){

	var vm = this;

	$rootScope.issues = [];

	vm.createIssue = function() {

		vm.message = '';
		Issue.create(vm.issueData)
		.then(function(response){

			// clear up the form's fields
			vm.issueData.title = '';
			vm.issueData.description = '';

			vm.message = response.data.message; 

			console.log("issue created: " + response.data.message);
			console.log("issue : " + response.data.issue);

			// insert latest issue in begining of array
			$rootScope.issues.unshift(response.data.issue);

			$location.path('/project_info');
		});

	};//createIssue

	vm.getIssuesForCurrentProject = function() {

		if(!$rootScope.currentProject) {
			console.log("getIssuesForCurrentProject - no current project is selected/found!");
			return; // FIXME - handle this error !!!
		}

		console.log("IssueController getting issues for current project");
		Issue.getIssuesForCurrentProject($rootScope.currentProject._id)
		.then(function(response){
			console.log("got issues: " + JSON.stringify(response));
			$rootScope.issues = response.data;
		});
	}

	console.log("IssueController");

	if($rootScope.currentProject) {
		vm.getIssuesForCurrentProject();
	}

});//IssueController