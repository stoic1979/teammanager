angular.module("mainCtrl", [])

.controller('MainController', function($rootScope, $location, Auth){


	var vm = this;

	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function(){

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data){
				vm.user = data.data;
			})

	});


	vm.doLogin = function(){

        console.log("MainController -> doLogin()");

		vm.processing = true;
		vm.error = '';
		Auth.login(vm.loginData.username, vm.loginData.password)
			.then(function(data){
				vm.processing = false;

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

			});
	};//doLogin

	vm.doLogout = function(){
		Auth.logout();
		$location.path('/logout');
	};

});//MainController
