angular.module('starter.land', [])

.controller('LandCtrl', function($scope, $ionicModal,$timeout,$state,$ionicViewSwitcher,LoginPessoa,$ionicLoading,$q,$localstorage,$ionicPopup,Password) {
	$scope.form=[];
	
	
	//****** ve se alguem esta logado
	
	if($localstorage.getObject('pessoa').idcliente>0)
	{
		console.log("esta logado");
		$state.go('app.geral');
		
	}
	
	
	
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
		      
		      console.log(profileInfo);
		      
		      LoginPessoa.login(profileInfo.id,"facebook").then(function(data){
			
					if(data.data[0].cliente>0)
					{
						console.log("sucess");
						$localstorage.setObject('pessoa', {
						idcliente: data.data[0].cliente,
						username: data.data[0].username,
						email: data.data[0].email,
						 nome: data.data[0].nome,
						distancia: data.data[0].distancia,
						categorias:data.data[0].categorias,
					       
					      });
					      $state.go('app.geral');
					}
					else
					{
						  $ionicPopup.alert({
							title: 'Aviso',
							template: 'Não existe nenhum utilizador facebook com estes dados, utilizar a opção criar conta.'
						      });
					}
					 $ionicLoading.hide();
					 
				});
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
							template: 'A carregar...'
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
	
	
	
	$scope.login=function(){
		if (!$scope.form.name&&!$scope.form.pass) {
			
			
				   $ionicPopup.alert({
				     title: 'Aviso',
				     template: 'Colocar as tuas credenciais para iniciar sessão.'
				   });
				 
				
		
		}else{
			LoginPessoa.login($scope.form.name,$scope.form.pass).then(function(data){
				
				if(data.data[0].cliente>0)
				{
					console.log("sucess");
					$localstorage.setObject('pessoa', {
				  idcliente: data.data[0].cliente,
				  username: data.data[0].username,
				  email: data.data[0].email,
				   nome: data.data[0].nome,
				  distancia: data.data[0].distancia,
				  categorias:data.data[0].categorias
				});
				
				$state.go('app.geral');
					
				}
				else
				{
					
					   $ionicPopup.alert({
					     title: 'Aviso',
					     template: 'Os dados indicados estão incorretos, voltar a tentar'
					   });
					 
					
				}
			});
		}	
		
	}
	
	
	$scope.login_fb=function(){
		
		$scope.facebookSignIn();
	}
	
	
	
	$scope.registar=function(){
		$state.go("registop1");	
	}
	
	$scope.go=function(){
		
		
		$ionicViewSwitcher.nextDirection("enter");
		$state.go("app.search");	
	}


	//=============== recuperar password
	$scope.recovery=function()
	{
			$scope.info_pass={};
			var myPopup = $ionicPopup.show({
		    template: '<input type="text" placeholder="Email de registo" ng-model="info_pass.email">',
		    title: '<span class="special_title">Recuperar a palavra-passe</span>',
		    subTitle: '',
		    scope: $scope,
		    buttons: [
		      { text: 'Cancelar' },
		      {
		        text: '<b>Recuperar</b>',
		        type: 'button-positive',
		        onTap: function(e) {
		          if (!$scope.info_pass.email) {
		            //don't allow the user to close unless he enters wifi password
		            e.preventDefault();
		          } else {
		            return $scope.info_pass.email;
		          }
		        }
		      }
		    ]
		  });
		
		  myPopup.then(function(res) {
			  Password.get(res).then(function(data){
				  console.log(data.data[0]);
				  var cor;
				  if (data.data[0].idmensagem=="-1") {
					cor="red";
				  }
				  else
				  {
					cor="rgb(79,185,92)";
				  }
				  $ionicPopup.alert({
				     title: '<span class="special_title">Recuperar a palavra-passe</span>',
				     template: '<span style="color:'+cor+'">'+data.data[0].pt+'</span>'
				   });
				  
			  })
		  });
  }		
 });
