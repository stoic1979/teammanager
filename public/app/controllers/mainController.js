angular.module("mainCtrl", [])

.controller('MainController', function($rootScope, $location, Auth, Project, Issue){

	var vm = this;

	$rootScope.projects = [];


	$rootScope.showSidebar = false;

	vm.loggedIn = Auth.isLoggedIn();

	//-----------------------------------------------------------------------------
	// listener on the $routeChangeStart event to track the next route navigation
	// get the user information
	//-----------------------------------------------------------------------------
	$rootScope.$on('$routeChangeStart', function(){

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data){
				$rootScope.user = data.data;
			})

	});//$rootScope.$on

	//--------------------------------------
	// get projects of logged in user
	//--------------------------------------
	if(vm.loggedIn) {

		$rootScope.showSidebar = true;

		Project.all()
		.then(function(response){
			$rootScope.projects = response.data.slice().reverse();

			console.log("got projects: " + JSON.stringify($rootScope.projects) );
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
					$rootScope.showSidebar = false;
					return;
				}

  				Auth.getUser()
				.then(function(data){
					$rootScope.user = data.data;
					console.log("$rootScope.user: " + JSON.stringify($rootScope.user) );

					$rootScope.showSidebar = true;
					$location.path('/');
				})
				.catch(function(data){
					vm.error = data.message;
					$rootScope.showSidebar = false;
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
		$rootScope.user = null;
		$rootScope.showSidebar = false;
		$location.path('/logout');
	};

	vm.setProject = function(project) {
		$rootScope.currentProject = project;
		console.log("current project is set to: " + $rootScope.currentProject._id);
		//IssueController.getIssuesForCurrentProject();

		Issue.getIssuesForCurrentProject($rootScope.currentProject._id)
		.then(function(response){
			console.log("main controller got issues: " + JSON.stringify(response));
			$rootScope.issues = response.data;
		});

	};

	vm.isManager = function() {
		if(!$rootScope.user) return false;
		return $rootScope.user.role == "MANAGER";
	};

	vm.isWorker = function() {
		if(!$rootScope.user) return false;
		return $rootScope.user.role == "WORKER";
	};

	vm.isAdmin = function() {
		if(!$rootScope.user) return false;
		return $rootScope.user.role == "ADMIN";
	};

	vm.isSidebarEnabled = function() {
		return $rootScope.showSidebar;
	}

	vm.toggleSidebar = function() {
		$("#wrapper").toggleClass("active");
		$("#menu-toggle").find('i').toggleClass('fa fa-angle-double-left').toggleClass('fa fa-angle-double-right');
	}

});//MainController
          