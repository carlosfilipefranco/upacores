angular.module('starter', ['ionic','pascalprecht.translate','ngCordova', 'starter.services','starter.controllers','starter.land','starter.registop1','starter.registop2','starter.geral','starter.favoritos','starter.mapa','starter.sitio'])

.run(function($ionicPlatform,$localstorage,UpdatePessoa,RegistarTelemovel,$rootScope,$state,Getidempresa,$ionicPopup) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
      StatusBar.hide();
    }
    
    $ionicPlatform.registerBackButtonAction(function(event) {
	   if($state.current.name=="app.geral"){
		   ;// navigator.app.exitApp(); //<-- remove this line to disable the exit
		  }
		  else {
		    navigator.app.backHistory();
		  }
  	}, 100);
  
  
  
    /*vai buscar a pessoa*/
    var pessoa = $localstorage.getObject('pessoa');
    
    /* aqui fica o gps*/
	
    var repete=true;
	//******************************************* foreground *****//
			var watchOptions = {
			  timeout : 30000,
			  enableHighAccuracy: true // may cause errors if true
			};

			var onSuccess = function(position) {
			    $rootScope.latitude=position.coords.latitude;
			    $rootScope.longitute=position.coords.longitude;
					  UpdatePessoa.set(pessoa.idcliente,pessoa.username,position.coords.latitude,position.coords.longitude).then(function(data){
						  
						  console.log(data);
					  })	
			};
			
			// onError Callback receives a PositionError object
			//
			function onError(error) {
				console.log(error);
				switch(error.code){
					
					case 2:{
					  	  console.log("gps off1");
					  	  $rootScope.$broadcast("gpsoff", {});	//o gps esta desactivado
					}
				}
			}
		    //GPSLocation.getCurrentPosition(onSuccess, onError,watchOptions);
			navigator.geolocation.watchPosition(onSuccess, onError, {
												  timeout: 30000,
												  enableHighAccuracy: true
												});
			function chama_gps(){
				console.log( 'aqui');	
				navigator.geolocation.getCurrentPosition(onSuccess, onError,watchOptions);
			  
			}	
			
			
			
			
		//***background******/
		var vez=0;
		//cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});	   
	
/*
		cordova.plugins.backgroundMode.enable();
		cordova.plugins.backgroundMode.setDefaults({
		    title:  "UpAcores",
		    ticker: "UpAcores continua consigo",
		    text:   "À procura das melhores oportunidades"
		})
*/
		var refreshIntervalId ;
		
		cordova.plugins.backgroundMode.onactivate = function () {
		  
		if (refreshIntervalId) { ; }else
		{
			    refreshIntervalId= setInterval(function () {
			    // Modify the currently displayed notification
			    vez=vez+1;
				var onSuccess2 = function(position) {
								UpdatePessoa.set(pessoa.idcliente,pessoa.username,position.coords.latitude,position.coords.longitude).then(function(data){
										  console.log(data);
						    	})	
							};
							
							// onError Callback receives a PositionError object
							//
				function onError2(error) {
						if (error.code==2) {
							    console.log("gps off2");
							    $rootScope.$broadcast("gpsoff", {});
						}
				}
				navigator.geolocation.getCurrentPosition(onSuccess2, onError2, {
													  timeout: 30000,
													  enableHighAccuracy: true
													});
				cordova.plugins.backgroundMode.configure({
					silent: true
			    });
			    
			}, 120000);
		  
		}
		}
	    cordova.plugins.backgroundMode.ondeactivate=function(){
		    clearInterval(refreshIntervalId);
				    
		 }
    	// cordova.plugins.autoStart.disable();
			
		
		
		//*************notificacaoes **************************************/
		
		function initPushwoosh()
		{
		  
		  
		    var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
		 
			pushNotification.onDeviceReady({pw_appid:"F4FF1-B3182"});


			document.addEventListener('push-notification', function(event) {
                                //get the notification payload
                                var userData = event.notification.userdata;
						        console.log(userData.empresa);           
						        if(typeof(userData) != "undefined") {
						            //console.warn('user data: ' + JSON.stringify(userData));
						       
						       
						        }
						        $state.go('app.sitio',{Id:userData.empresa});
                                //display alert to the user for example
                                        
                                //clear the app badge
                                pushNotification.setApplicationIconBadgeNumber(0);
            });
 
            //initialize the plugin
           
            //register for pushes
            pushNotification.registerDevice(
                function(status) {
	                
	                
	                
                    var id = $localstorage.getObject('id');
		            var pessoa = $localstorage.getObject('pessoa');
					if(pessoa.idcliente>0)
		            {
			          	$localstorage.setObject('id', { udid:status['pushToken']});
					  	var id = $localstorage.getObject('id');
					  	RegistarTelemovel.set(pessoa.idcliente,id.udid).then(function(){
							console.log("actualizado");
						})
		            }
		            else
		            {
			            ;
		            }


                },
                function(status) {
                    console.warn('failed to register : ' + JSON.stringify(status));
                   
                }
            );

            //reset badges on app start
            pushNotification.setApplicationIconBadgeNumber(0);
		  
			
		}	
		initPushwoosh();
	});
    
    
    
    
    // net check 
    
    var pop;
	var networkState = navigator.connection;
/*

	setTimeout(function(){
	    networkState = navigator.connection;
	    //alert('networkState = '+networkState);
	    var networkStatedata=networkState.type;
	    if(networkStatedata=="none")
	    {
		    var pop=  $ionicPopup.alert({

		       title: 'Aviso',
		
		       subTitle: 'Tem de estar ligado à internet para fazer uso da app',
		
		   });
		    
		   
	    }
	    else
	    {
		  if(pop)
		  {
			  pop.close();
		  }
	    }
		console.log(networkState);
	 },1);
*/

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
   .state('land', {
    url: '/land',
    templateUrl: 'controllers/land/land.html',
    controller: 'LandCtrl'
  })
  /*way one*/
  $stateProvider
   .state('registop1', {
    url: '/registop1',
    templateUrl: 'controllers/registop1/registop1.html',
    controller: 'Registop1Ctrl'
  })
  $stateProvider
   .state('registop2', {
    url: '/registop2',
    templateUrl: 'controllers/registop2/registop2.html',
    controller: 'Registop2Ctrl'
  })
  /*way two*/
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.geral', {
    url: '/geral',
    views: {
      'menuContent': {
        templateUrl: 'controllers/geral/geral.html',
        controller: 'GeralCtrl'
      }
    }
  })
  .state('app.favoritos', {
    url: '/favoritos',
    views: {
      'menuContent': {
        templateUrl: 'controllers/favoritos/favoritos.html',
        controller: 'FavoritosCtrl'
      }
    }
  })
  .state('app.mapa', {
    url: '/mapa',
    views: {
      'menuContent': {
        templateUrl: 'controllers/mapa/mapa.html',
        controller: 'MapaCtrl'
      }
    }
  })

  .state('app.sitio', {
    url: '/sitio/:Id',
    views: {
      'menuContent': {
        templateUrl: 'controllers/sitio/sitio.html',
        controller: 'SitioCtrl'
      }
    }
  })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/land');
});
