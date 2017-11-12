angular.module('projectCtrl', ['projectService'])

.controller('ProjectController', function($rootScope, Project, Issue, $location, $window){

	var vm = this;




	vm.createProject = function() {

		vm.message = '';
		Project.create(vm.projectData)
		.then(function(response){

			// clear up the form's fields
			vm.projectData.title = '';
			vm.projectData.description = '';

			vm.message = response.data.message; 

			console.log("project created: " + response.data.message);
			console.log("project : " + response.data.project);

			// insert latest project in begining of array
			$rootScope.projects.unshift(response.data.project);

			$rootScope.currentProject = response.data.project;			

			$location.path('/');
		});

	};//createProject

});//ProjectController