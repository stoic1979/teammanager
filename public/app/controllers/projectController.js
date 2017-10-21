angular.module('projectCtrl', ['projectService'])

.controller('ProjectController', function(Project){

	var vm = this;

	Project.all()
	.then(function(response){
		console.log("-- got stories: " + JSON.stringify(response.data));

		// show stories in reverse order of creation
		// means, latest at top pos in list
		vm.stories = response.data.slice().reverse();
	});	

	vm.createProject = function() {

		vm.message = '';
		Project.create(vm.projectData)
		.then(function(response){

			// clear up the form's fields
			vm.projectData.content = '';

			vm.message = response.data.message; 

			console.log("project created: " + response.data.message);
			console.log("project : " + response.data.project);

			// insert latest project in begining of array
			vm.stories.unshift(response.data.project);
		});

	};//createProject

});//ProjectController