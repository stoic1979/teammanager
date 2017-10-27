angular.module('projectCtrl', ['projectService'])

.controller('ProjectController', function(Project, $location, $window){

	var vm = this;

	vm.projects = [];

	Project.all()
	.then(function(response){
		console.log("-- got projects: " + JSON.stringify(response.data));


		// show projects in reverse order of creation
		// means, latest at top pos in list
		vm.projects = response.data.slice().reverse();
	});	

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
			vm.projects.unshift(response.data.project);

			$location.path('/');
		});

	};//createProject

});//ProjectController