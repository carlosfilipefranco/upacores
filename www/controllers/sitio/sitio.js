angular.module('starter.sitio', [])

.controller('SitioCtrl', function($ionicHistory,$scope, $ionicModal,$timeout,$state,$ionicViewSwitcher,ObterSitio,$stateParams,SitioMensagens,$ionicPopup,Bloquearpagina,$localstorage,$rootScope,RegistarFavorito,$ionicLoading,ObtemCoords) {
	var pessoa = $localstorage.getObject('pessoa');
	$scope.items=[];
	$scope.mensagens=[];
    $scope.inicio=-5;
    $scope.nomoredata=false;

	$scope.complete_registo=function(){
		alert("complete");
	}
  $scope.voltar=function(){
    
      $ionicHistory.goBack();

  }
  
  //==================bloquear pagina 
  
  
  $scope.bloquear=function(){
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Alerta',
	     template: 'Tens a certeza que queres bloquear esta página?'
	   });
	
	   confirmPopup.then(function(res) {
	     if(res) {
	       Bloquearpagina.set(pessoa.idcliente,pessoa.username,$stateParams.Id).then(function(data){
		       
		       console.log(data);
		       $rootScope.actualiza();
	       })
	       
	     } else {
	       console.log('You are not sure');
	     }
	   });
	  
  }
  
  
  
  
  //========== obterm dados
  
  ObterSitio.get($stateParams.Id).then(function(data){
	  console.log(data);
	  
	  var info=data.data[0];
	  
	  $scope.titulo=info.nome;
	  $scope.descricao=info.descricao;
	  $scope.website=info.site;
	  $scope.logo=info.imagem_perfil;
	  $scope.banner=info.imagem_topo;
	  $scope.telefone=info.telefone;
	  $scope.moradas=info.moradas;
	  $scope.email=info.email;
	  
	  
  })
  
  //========== obter mensagens sitio
  $scope.loadMore = function() {
		 
		 					$scope.inicio+=5;
		                    if ($scope.nomoredata==false) {
		
		                        SitioMensagens.get($stateParams.Id,$scope.inicio,pessoa.idcliente).then(function(resposta){
		                       console.log(resposta);
		                         if (resposta.data.length>0) {
		                      
										
									for (i=0;i<resposta.data.length;i++) {
							
											    $scope.mensagens.push({'id':resposta.data[i].idmensagem,'titulo':resposta.data[i].nomeempresa,'imagem':resposta.data[i].imagem,'mensagem':resposta.data[i].mensagem,'favorito':resposta.data[i].favorito,'data':resposta.data[i].data_envio})
							
									}
						          }
		                         else{
		                            if($scope.mensagens.length==0)
		                            {
		                                 $scope.items.push({'id':0,'titulo':'Sem Resultados','imagem':'','mensagem':''})
		                            }
		
		
		                           $scope.nomoredata=true;
		
		                         }
		
		                         $scope.$broadcast('scroll.infiniteScrollComplete');
		
		                     });
		
		                    }
		                    else
		                    { 
			                    $scope.$broadcast('scroll.infiniteScrollComplete'); 
			                }
			                
			  
		
  }
	                
	$scope.loadMore();    
  
  //=======favorito ===========
  
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
	  RegistarFavorito.set(pessoa.idcliente,id,pessoa.username).then(function(state){
		  
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
  // partilhar 
  
  $scope.share=function(id){
		 $ionicLoading.show({
	      template: 'Espere um momento...'
	    })
		var options ;
		console.log(id);
		
		for(i=0;i<$scope.mensagens.length;i++)
		{	
			if($scope.mensagens[i].id==id)
			{
				console.log($scope.mensagens[i].titulo);
				options = {
				  message: $scope.mensagens[i].titulo+' - '+$scope.mensagens[i].mensagem, // not supported on some apps (Facebook, Instagram)
				  subject: 'UpAzores - '+$scope.mensagens[i].titulo, // fi. for email
				  files:[$scope.mensagens[i].imagem],
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
		
	
	
	
	
   //ir para sitio mais perto
   
   $scope.location_go=function(){
		 $ionicLoading.show({
	      template: 'Espere um momento...'
	    })
	    
	   
		ObtemCoords.get($stateParams.Id,pessoa.idcliente).then(function(data3){
					 $ionicLoading.hide();
					var data=data3.data[0];
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
	
  
  

 })
 
 
.directive('fakeStatusbar', function() {
  return {
    restrict: 'E',
    replace: true
  }
})
.directive('headerShrink', function($document) {
  var fadeAmt;

  var shrink = function(header, content, amt, max) {
    amt = Math.min(44, amt);
    fadeAmt = 1 - amt / 44;
    ionic.requestAnimationFrame(function() {
      header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
      for(var i = 0, j = header.children.length; i < j; i++) {
        header.children[i].style.opacity = fadeAmt;
      }
    });
  };

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      var starty = $scope.$eval($attr.headerShrink) || 0;
      var shrinkAmt;
      
      var header = $document[0].body.querySelector('.bar-header2');
      var headerHeight = header.offsetHeight;
      
      $element.bind('scroll', function(e) {
        var scrollTop = null;
        if(e.detail){
          scrollTop = e.detail.scrollTop;
        }else if(e.target){
          scrollTop = e.target.scrollTop;
        }
        if(scrollTop > starty){
          // Start shrinking
          shrinkAmt = headerHeight - Math.max(0, (starty + headerHeight) - scrollTop);
          shrink(header, $element[0], shrinkAmt, headerHeight);
        } else {
          shrink(header, $element[0], 0, headerHeight);
        }
      });
    }
  }
})



    


.directive('buttonRotate', function() {
  var descricao_open=false;
  return {
    restrict : 'A',
    

    link : function(scope, elem, attrs) {
   

    elem.on('click', function() {
    	 
    	  var queryResult = angular.element(document.querySelector('#detalhes_big'));
		  

     	  if(descricao_open != true) {
          	
          		angular.element(elem).removeClass("direita");
          		queryResult.addClass("show");
          		descricao_open=true;
          		
       	  } else {
          		
          		descricao_open=false;
          		angular.element(elem).addClass("direita");
          		queryResult.removeClass("show");
        }
     });
    
      /*
      var currentState = true;
      
      elem.on('click', function() {
        console.log('You clicked me!');
        
        if(currentState === true) {
          console.log('It is on!');
          angular.element(elem).removeClass(attrs.onIcon);
          angular.element(elem).addClass(attrs.offIcon);
        } else {
          console.log('It is off!');
          angular.element(elem).removeClass(attrs.offIcon);
          angular.element(elem).addClass(attrs.onIcon);
        }
        
        currentState = !currentState

      });
      
      */
    }
  };
}); 