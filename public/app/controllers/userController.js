angular.module('userCtrl', ['userService'])

.controller('UserController', function(User){

	var vm = this;

	User.all()
	.then(function(response){
		console.log("-- got users: " + JSON.stringify(response));
		vm.users = response;

	});	

})//UserController

.controller('UserCreateController', function(User, $location, $window){

	var vm = this;

	vm.signupUser = function() {
		vm.message = '';

		User.create(vm.userData)
		.then(function(response){
			vm.userData = {};
			vm.message = response.data.message;

			//$window.localStorage.setItem('token', response.data.token);

			$location.path('/signup_done');
		})
	};

}) // UserCreateController
