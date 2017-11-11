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

	//--------------------------------------
	// get projects of logged in user
	//--------------------------------------
	if(vm.loggedIn) {
		Project.all()
		.then(function(response){
			$rootScope.projects = response.data.slice().reverse();

			console.log("got projects: " + $rootScope.projects.length);
			// if current project is not set in root scope, 
			// set it to the first one by default
			if(!$rootScope.currentProject && $rootScope.projects.length > 0) {
				$rootScope.currentProject = $rootScope.projects[0];
			}
		});	
	}

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

				// ensure sucess flag in response data
				if(!data.success) {
					vm.error = data.message;
					return;
				}

  				Auth.getUser()
				.then(function(data){
					vm.user = data.data;
					console.log("vm.user: " + JSON.stringify(vm.user) );
					$location.path('/');
				})
				.catch(function(data){
					vm.error = data.message;
				});

			})
			.catch(function(data){
				vm.error = data.message;
			});
	};//doLogin

	//-------------------------
	// doLogout()
	//-------------------------
	vm.doLogout = function(){
		Auth.logout();
		$location.path('/logout');
	};

	vm.setProject = function(project) {
		$rootScope.currentProject = project;
		console.log("current project is set to: " + $rootScope.currentProject._id);
	}

});//MainController
