angular.module('starter.registop1', [])

.controller('Registop1Ctrl', function($scope, $cordovaFacebook,$ionicModal,$timeout,$state,$ionicViewSwitcher,RegistarPessoa,$localstorage,$ionicLoading,$q,RegistarTelemovel,$ionicPopup,UpdatePessoa,$rootScope) {
	
	
	$scope.form=[];
	//****************Facebook funcs
	
	// This method is to get the user profile info from the facebook api
	  var getFacebookProfileInfo = function (authResponse) {
		    var info = $q.defer();
		
		    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
		      function (response) {
						console.log(response);
		        info.resolve(response);
		      },
		      function (response) {
						console.log(response);
		        info.reject(response);
		      }
		    );
		    return info.promise;
	  };
  
  
	var fbLoginSuccess = function(response) {
	    if (!response.authResponse){
	      fbLoginError("Cannot find the authResponse");
	      return;
	    }
	    
	    var authResponse = response.authResponse;
	
	    getFacebookProfileInfo(authResponse)
	    .then(function(profileInfo) {
		      // For the purpose of this example I will store user data on local storage
		      
		      RegistarPessoa.registar(profileInfo.name,profileInfo.email,profileInfo.id,'facebook').then(function(result){
				console.log(result);
				
					if(result.data[0].cliente==-1)
					{
						//ja existe um registo com esses dados
						$ionicLoading.hide();
						console.log("dados ja existentes, use o botao de login na entrada");
					}
					else if(result.data[0].cliente>0)
					{
						console.log("registado");
						$localstorage.setObject('pessoa', {
		                  idcliente: result.data[0].cliente,
		                  username: profileInfo.name,
		                  nome: profileInfo.name,
		                  email: $scope.form.email,
		                  distancia: 1000,
		                  categorias:""
		                });
		                $ionicLoading.hide();
		                 var id = $localstorage.getObject('id');
						RegistarTelemovel.set(result.data[0].cliente,id.udid).then(function(data){
							console.log(data);
							
							
var watchOptions = {
											  timeout : 100000,
											  enableHighAccuracy: false // may cause errors if true
											};
								
											var onSuccess = function(position) {
											    $rootScope.latitude=position.coords.latitude;
											    $rootScope.longitute=position.coords.longitude;
											          var pessoa = $localstorage.getObject('pessoa');
		
													  UpdatePessoa.set(pessoa.idcliente,pessoa.username,position.coords.latitude,position.coords.longitude).then(function(data)											  {
														  console.log("//===================");
														  console.log(data);
														  console.log("//===================");
													  })	
											};
											
											// onError Callback receives a PositionError object
											//
											function onError(error) {
												
												switch(error.code){
													
													case 2:{
													  	  console.log("gps off1");
													  	  $rootScope.$broadcast("gpsoff", {});	//o gps esta desactivado
													}
												}
											}
											navigator.geolocation.watchPosition(onSuccess, onError, {
													  timeout: 30000,
													  enableHighAccuracy: false
													});
													
													
													
							 $state.go('registop2');
						})
		               
						
					}
					
				
			})
		
		
		
		
				
		       // picture : htt:/graph.facebook.com/ + authResponse.userID + "/picture?type=large"
		     	     		     
		    }, function(fail){
		      // Fail get profile info
		      console.log('profile info fail', fail);
		    });
	  };
	
	  // This is the fail callback from the login method
	  var fbLoginError = function(error){
	    console.log('fbLoginError', error);
	    $ionicLoading.hide();
	  };



	
	 $scope.facebookSignIn = function() {
		    facebookConnectPlugin.getLoginStatus(function(success){
		      if(success.status === 'connected'){
		        // The user is logged in and has authenticated your app, and response.authResponse supplies
		        // the user's ID, a valid access token, a signed request, and the time the access token
		        // and signed request each expire
		        console.log('getLoginStatus', success.status);
		        $ionicLoading.show({
							template: 'Logging in...'
						});
				facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
		
		      } else {
		        // If (success.status === 'not_authorized') the user is logged in to Facebook,
						// but has not authenticated your app
		        // Else the person is not logged into Facebook,
						// so we're not sure if they are logged into this app or not.
		
						console.log('getLoginStatus', success.status);
		
						$ionicLoading.show({
							template: 'Logging in...'
						});
		
						// Ask the permissions you need. You can learn more about
						// FB permissions here: https:/developers.facebook.com/docs/facebook-login/permissions/v2.4
						facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
		      }
		    });
    }
	
	//******************************
	
	$scope.fb_register=function()
	{
		
		 $scope.facebookSignIn();
		
	}
	function success_fb(data){
		
		console.log(data);
	}


	function error_fb(data){
		
		console.log(data);
	}

	$scope.register=function()
	{
		
		$ionicLoading.show({
		      template: 'Por favor espere...'
		});
		
		var testar_string=$scope.form.nome;
		/*ver se tem caracteres especiais ou espaços*/
		if (/^[a-zA-Z0-9-]*$/.test(testar_string)==false) {
			 $ionicPopup.alert({
				 title: 'Aviso',
				 template: 'Não são permitidos espaços ou caracteres especiais no campo username'
			 });
			 $ionicLoading.hide();
		}
		else
		{
				RegistarPessoa.registar("User",$scope.form.email,$scope.form.nome,$scope.form.password).then(function(result){
						$ionicLoading.hide();
						if(result.data[0].cliente==-1)
						{
							//ja existe um registo com esses dados
							console.log("dados ja existentes");
							 $ionicPopup.alert({
							     title: 'Aviso',
							     template: 'Já existe um utilizador com esse email. Por favor use o login.'
							   });
						}
						else if(result.data[0].cliente>0)
						{
							console.log("registado");
							$localstorage.setObject('pessoa', {
								idcliente: result.data[0].cliente,
								username: $scope.form.nome,
								email: $scope.form.email,
								nome: "User",
								distancia: 1000,
								categorias:""
							      });
					
					
							 var id = $localstorage.getObject('id');
								RegistarTelemovel.set(result.data[0].cliente,id.udid).then(function(data){
									
									
											var watchOptions = {
											  timeout : 100000,
											  enableHighAccuracy: false // may cause errors if true
											};
								
											var onSuccess = function(position) {
											    $rootScope.latitude=position.coords.latitude;
											    $rootScope.longitute=position.coords.longitude;
											          var pessoa = $localstorage.getObject('pessoa');
		
													  UpdatePessoa.set(pessoa.idcliente,pessoa.username,position.coords.latitude,position.coords.longitude).then(function(data)											  {
														  console.log("//===================");
														  console.log(data);
														  console.log("//===================");
													  })	
											};
											
											// onError Callback receives a PositionError object
											//
											function onError(error) {
												
												switch(error.code){
													
													case 2:{
													  	  console.log("gps off1");
													  	  $rootScope.$broadcast("gpsoff", {});	//o gps esta desactivado
													}
												}
											}
											navigator.geolocation.watchPosition(onSuccess, onError, {
													  timeout: 30000,
													  enableHighAccuracy: false
													});



									 $state.go('registop2');
											//===
										
											
													
/*
											cordova.plugins.locationServices.geolocation.watchPosition(onSuccess, onError, {
												  timeout: 30000,
												  priority: cordova.plugins.locationServices.geolocation.priorities.PRIORITY_HIGH_ACCURACY
												});
										    
*///GPSLocation.getCurrentPosition(onSuccess, onError,watchOptions);
										
										//====


								})
								
								
								
																
										
						}
						
					
				})
		}
		
		

	}

	$scope.login=function()
	{
		$state.go('land');
	}

	$scope.termos=function()
	{
		alert("termos");
	}
	
 });
