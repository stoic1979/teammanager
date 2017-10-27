angular.module("mainCtrl", [])

.controller('MainController', function($rootScope, $location, Auth, Project){


	var vm = this;

	$rootScope.projects = [];


	vm.loggedIn = Auth.isLoggedIn();


	//-----------------------------------------------------------------------------
	// listener on the $routeChangeStart event to track the next route navigation
	// get the user information
	//-----------------------------------------------------------------------------
	$rootScope.$on('$routeChangeStart', function(){

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data){
				vm.user = data.data;
			})

	});//$rootScope.$on

	// get projects of logged in user
	Project.all()
	.then(function(response){
		$rootScope.projects = response.data.slice().reverse();
	});	

	//-------------------------
	// doLogin()
	//-------------------------
	vm.doLogin = function(){

        console.log("MainController -> doLogin()");

		vm.processing = true;
		vm.error = '';
		Auth.login(vm.loginData.username, vm.loginData.password)
			.then(function(data){
				vm.processing = false;

  				Auth.getUser()
				.then(function(data){

					console.log(">>--> data: " + JSON.stringify(data) );

					vm.user = data.data;
					console.log("vm.user: " + JSON.stringify(vm.user) );
					$location.path('/');
				})
				.catch(function(data){
					vm.error = data.message;
				});

			})
			.catch(function(data){

			});
	};//doLogin

	//-------------------------
	// doLogout()
	//-------------------------
	vm.doLogout = function(){
		Auth.logout();
		$location.path('/logout');
	};

});//MainController
