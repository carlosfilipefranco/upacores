angular.module('starter.geral', [])

.controller('GeralCtrl', function($scope, $ionicModal,$timeout,$state,$ionicPopup,$ionicViewSwitcher,$rootScope,ObterMensagens,$localstorage,RegistarFavorito,ObtemCoords,$ionicLoading) {
	
	$scope.empty=false;;
	$scope.empty2=false;
    $scope.items=[];
    $scope.inicio=-5;
    $scope.fim=0;
    $scope.categoria_corrente;
    $scope.muda;
    $scope.elementos_cat=[];
    $scope.nomoredata=false;
    var pessoa = $localstorage.getObject('pessoa').idcliente;
    console.log("aqui"+pessoa);
    var username=$localstorage.getObject('pessoa').username;
    
    
    $scope.refresh_all=function(){
			$scope.items=[];
			$scope.$broadcast('scroll.refreshComplete');
			$scope.inicio=-5;
			$scope.nomoredata=false;
			$scope.loadMore();
		
	}


	$rootScope.$on("gpsoff", function(events, args){
		 $ionicPopup.alert({
				     title: 'Aviso',
				     template: 'Tens o GPS deactivado. Ativa-o para teres acesso a todas as funcionalidades'
				   });
	})
    
    
    
	$rootScope.refresh_geral=function(){
		alert("refresh geral");
		
	}
	$scope.complete_registo=function(){
		alert("complete");
	}
	$scope.share=function(id){
		 $ionicLoading.show({
	      template: 'Espere um momento...'
	    })
		var options ;
		console.log(id);
		
		for(i=0;i<$scope.items.length;i++)
		{	
			if($scope.items[i].id==id)
			{
				console.log($scope.items[i].titulo);
				options = {
				  message: $scope.items[i].titulo+' - '+$scope.items[i].mensagem, // not supported on some apps (Facebook, Instagram)
				  subject: 'UpAzores - '+$scope.items[i].titulo, // fi. for email
				  files:[$scope.items[i].imagem],
				  chooserTitle: 'Escolha uma aplicação' // Android only, you can override the default share sheet title
				}
			}
		}
		
		
		
			
			var onSuccess = function(result) {
			  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
			  console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
			   $ionicLoading.hide();
			}
			
			var onError = function(msg) {
			  console.log("Sharing failed with message: " + msg);
			   $ionicLoading.hide();
			}
			
			window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
	}
	
	$scope.location_go=function(empresa){
		 $ionicLoading.show({
	      template: 'Espere um momento...'
	    })
		for(i=0;i<$scope.items.length;i++)
		{	
			if($scope.items[i].id==empresa)
			{
				console.log($scope.items[i].idempresa);
				ObtemCoords.get($scope.items[i].idempresa,pessoa).then(function(data){
					 $ionicLoading.hide();
					var data=data.data[0];
				 	var address=data.latitude+", "+data.longitude;
			        var url='';
			        if(ionic.Platform.isIOS()){
			            url="http://maps.apple.com/maps?q="+encodeURIComponent(address);
			        }else{
			            //this will be used for browsers if we ever want to convert to a website
			            url="http://maps.google.com?q="+encodeURIComponent(address);
			        }
			        window.open(url, "_system", 'location=no');
						
			
				})
			}
		}

        
	}
	
	
	$scope.favorito=function(id){
	  var elemento=this.id;
	  var queryResult = angular.element(document.querySelector('#favorito_'+id));
	 
	  if(queryResult.hasClass("ion-android-star-outline"))
	  {
		   queryResult.removeClass("ion-android-star-outline");
		   queryResult.addClass("ion-android-star");;
	  }
	  else
	  {
		   queryResult.addClass("ion-android-star-outline");
		   queryResult.removeClass("ion-android-star");
	  }
	  RegistarFavorito.set(pessoa,id,username).then(function(state){
		  
		  console.log(state);
		  if(state=="-1")
		  {
			  console.log("oops");
			  if(queryResult.hasClass("ion-android-star-outline"))
			  {
				   queryResult.removeClass("ion-android-star-outline");
				   queryResult.addClass("ion-android-star");;
			  }
			  else
			  {
				   queryResult.addClass("ion-android-star-outline");
				   queryResult.removeClass("ion-android-star");
			  }
		  }
		  
	  })
	 
	}
	
	$scope.go_place=function(id){
		$state.go('app.sitio',{Id:id});
		
	}
	
	//=========listagem==================
	 $scope.loadMore = function() {
	 				$scope.inicio+=5;

                    if ($scope.nomoredata==false) {
						$scope.empty=true;
                       ObterMensagens.get(pessoa,$scope.inicio).then(function(resposta){
                        console.log(resposta.data);
                         if (resposta.data.length>0) {
                      
								
							for (i=0;i<resposta.data.length;i++) {
					
									    $scope.items.push({'id':resposta.data[i].idmensagem,'idempresa':resposta.data[i].idempresa,'titulo':resposta.data[i].nomeempresa,'imagem':resposta.data[i].imagem,'mensagem':resposta.data[i].mensagem,'favoritos':resposta.data[i].favoritos,'data':resposta.data[i].data_envio})
					
							}
				          }
                         else{
                            if($scope.items.length==0)
                            {
	                            $scope.empty=false;
                                 
                            }


                           $scope.nomoredata=true;

                         }

                         $scope.$broadcast('scroll.infiniteScrollComplete');

                     });

                    }
                    else
                    { 
	                    $scope.empty=false;
	                    $scope.$broadcast('scroll.infiniteScrollComplete'); 
	                }
	}
	
	
	
	$rootScope.$on("recarregar", function(events, args){
		$scope.empty=false;;
	       $scope.empty2=false;
	       $scope.items=[];
	       $scope.inicio=-5;
	       $scope.fim=0;
	       $scope.categoria_corrente;
	       $scope.muda;
	       $scope.elementos_cat=[];
	       $scope.nomoredata=false;
	       $scope.loadMore();
	});

	$rootScope.$on("actualizamapa", function(){
		$scope.empty=false;;
	       $scope.empty2=false;
	       $scope.items=[];
	       $scope.inicio=-5;
	       $scope.fim=0;
	       $scope.categoria_corrente;
	       $scope.muda;
	       $scope.elementos_cat=[];
	       $scope.nomoredata=false;
	       $scope.loadMore();
	});
	
	
 });
