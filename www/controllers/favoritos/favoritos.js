angular.module('starter.favoritos', [])

.controller('FavoritosCtrl', function($scope, $ionicModal,$timeout,$state,$ionicViewSwitcher,ObtemFavoritos,$localstorage,RegistarFavorito,$ionicLoading,ObtemCoords) {
	
	
	$scope.empty=false;;
	$scope.empty2=false
	$scope.items=[];
    $scope.inicio=-5;
    $scope.fim=0;
    $scope.categoria_corrente;
    $scope.muda;
    $scope.elementos_cat=[];
    $scope.nomoredata=false;
    
    var pessoa = $localstorage.getObject('pessoa').idcliente;
    var username=$localstorage.getObject('pessoa').username;

	$scope.complete_registo=function(){
		alert("complete");
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
	 

		
	}
	
	
	$scope.share=function(id){
		$ionicLoading.show({
	      template: 'Espere um momento...'
	    });
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
				 /* url: 'https://www.website.com/foo/#bar?a=b',*/
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
	    });
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
	
	$scope.go_place=function(id){
		$state.go('app.sitio',{Id:id});
		
	}
	
	
	
	//=========listagem==================
	$scope.refresh_fav=function(){
			$scope.items=[];
			$scope.$broadcast('scroll.refreshComplete');
			$scope.inicio=-5;
			$scope.nomoredata=false;
			$scope.loadMore();
		
	}
	
	
	$scope.remove=function(remove){
		for(i=0;i<$scope.items.length;i++)
		{
			
			if($scope.items[i].id==remove)
			{
				$scope.items.splice($scope.items[i], 1);
				console.log("econ");
			}
			
		}
		console.log($scope.items.length);
		if($scope.items.length<=0)
		{
			console.log("Aqui");
			$scope.empty=false;
		}
		RegistarFavorito.set(pessoa,remove,username).then(function(state){
		  
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
	
	
	
	$scope.favorito=function(id){
	  var elemento=this.id;
	  
	  console.log(id);
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
	  
	  }
	  
	  
	  
	$scope.loadMore = function() {
	 				$scope.inicio+=5;

                    if ($scope.nomoredata==false) {

                       ObtemFavoritos.get(pessoa,$scope.inicio).then(function(resposta){
                       console.log(resposta);
                         if (resposta.data.length>0) {
                      
								$scope.empty=true;;
							for (i=0;i<resposta.data.length;i++) {
					
									    $scope.items.push({'id':resposta.data[i].id,'idempresa':resposta.data[i].idempresa,'titulo':resposta.data[i].nome,'imagem':resposta.data[i].imagem,'mensagem':resposta.data[i].mensagem,'data':resposta.data[i].dataenvio})
					
							}
				          }
                         else{
                          //	$scope.empty=false;;
                           $scope.nomoredata=true;

                         }

                         $scope.$broadcast('scroll.infiniteScrollComplete');

                     });

                    }
                    else
                    { 
	                    	$scope.empty=true;;

	                    $scope.$broadcast('scroll.infiniteScrollComplete'); 
	                }
   }


 });
