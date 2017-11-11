angular.module('issueCtrl', ['issueService'])

.controller('IssueController', function($rootScope, Issue, $location, $window){

	var vm = this;

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

			$location.path('/');
		});

	};//createIssue

});//IssueController