angular.module('starter.mapa', ['ngMap'])

.controller('MapaCtrl', function($scope, $ionicModal,$timeout,$state,$ionicViewSwitcher,NgMap,$rootScope,ListagemMapa,$localstorage,UltimaMensagem,$stateParams,RegistarFavorito) {
	$scope.pinos=[];
	var init=0;
	
	var pessoa = $localstorage.getObject('pessoa').idcliente;
    var username=$localstorage.getObject('pessoa').username;
	$scope.empty=false;
	$scope.valorfavorito;
	$scope.favorito_img;
	$scope.favorito_text;
	$scope.favorito_titulo;
	$scope.clicado_longitude;
	$scope.clicado_latitude;
	$scope.lastclicked;
	$scope.lastclickedpreto;
	var selected;
	console.log($scope.pinos);
	var map2;
 	var map3;
	$scope.centro_lat=38.6793456;
	$scope.centro_long=-27.2238018;
	$scope.center_map=function(){
		
			$scope.centro_lat=$rootScope.latitude;
			$scope.centro_long=$rootScope.longitute;
		
			  
	}
 	
 	$rootScope.refresh_mapa=function(){
		alert("refresh mapas");
		
	}
	
	
	$scope.$on('mapInitialized', function(event, m) {
		map3 = m;
	      });
   	NgMap.getMap().then(function(map) {
       map2=map;
     });
 	$scope.pinoclick= function() {
     		//console.log(this);
     		
     		
     		var elemento=this.id;
	 		
     		console.log("index clicaddo"+elemento);
		console.log(this);
     		var queryResult = angular.element(document.querySelector('#mensagem_visivel'));
	 		console.log($scope.lastclicked);

		  	//nenhum carregado carreguei num verde sem haver nenhum previamente selecionado
		  	
		if(map2.markers[elemento])  	
		{
			if(!$scope.lastclicked)
            {
	            console.log("hey");
            		map2.markers[elemento].setMap(null);
            		queryResult.removeClass("show");
            		$scope.lastclicked=this.id;
            		var selected=this.id[6];
            }
            else if(elemento[4]=="v")
		  	{
		  		queryResult.addClass("show");
		  			if($scope.lastclicked[4]=="p")
		  			{
		  				console.log('aqui');
		  				
		  					map2.markers[elemento].setMap(null);		  			}
		  			else{


			  			var novo2="pinov_"+selected;
			  			map2.markers[$scope.lastclicked].setMap(map2);
			  			map2.markers[elemento].setMap(null);
		  			}
		  			$scope.lastclicked=this.id;
            
		  	}
		  	//carreguei num preto
		  	if(elemento[4]=="p")
		  	{
		  			var novo='pinov_'+elemento[6];
		  			map2.markers[novo].setMap(map2);
		  			queryResult.removeClass("show");
		  			var novo='pinop_'+elemento[6];
		  			$scope.lastclicked=novo;
		  			selected=true;
            		
		  	}

		  	$scope.segue_mensagem=function(){
		  		

		  		$state.go('app.sitio',{Id:$scope.escolhido});
		  	}

		  	
            if(init==0)
		  	{
			  	
			  	queryResult.addClass("show");
			  
			  	
			  	console.log("aqui");
			  	init=1;
		  	}
		  	
		  
		  	//carrega conteudo empresa clicada
		  	
		  	
		  	var selected=this.id[6];
		  	
		  	
		  	$scope.ultimamensagem=$scope.pinos[selected];
		  	console.log($scope.ultimamensagem);
		  	$scope.escolhido=$scope.pinos[selected].idempresa;
		  	$scope.mensagem;
		  	console.log($scope.escolhido);
		  	
			$scope.clicado_longitude=$scope.pinos[selected].longitude;
			$scope.clicado_latitude=$scope.pinos[selected].latitude;
			console.log("idempresa "+this.idempresa);
			
			
			$scope.titulo='A carregar';
			$scope.imagem='';
			$scope.favorito_titulo= '';
			$scope.data='';		 
					 
		  	UltimaMensagem.get($scope.escolhido,pessoa).then(function(data){
			  	console.log("duuude");
				console.log($scope.pinos);
			  	for(i=0;i<$scope.pinos.length;i++)
			  	{
				  	
				  	if($scope.pinos[i].idempresa==$scope.ultimamensagem.idempresa)
				  	{
					  	$scope.titulo=$scope.pinos[i].nomeempresa;
					  	$scope.imagem=$scope.pinos[i].imagem;
					 $scope.favorito_titulo= $scope.titulo;	
					$scope.favorito_img=$scope.imagem;
					$scope.favorito_text=$scope.titulo+' - ';
				  	}
			  	}
			  	
			  	console.log(data.data[0]);
			  	if(data.data[0].idmensagem>0)
			  	{
					console.log("hye");
				  	$scope.valorfavorito=data.data[0].idmensagem;
					$scope.mensagem=data.data[0].idmensagem;
					$scope.mensagemid=data.data[0].idmensagem;
					$scope.mensagem=data.data[0].mensagem;
					$scope.data=data.data[0].data_envio;
					$scope.favorito=data.data[0].favorito;
					$scope.empty=false;  	
					$scope.favorito_text+=$scope.mensagem;
			  	}
			  	else{
				  	$scope.empty=true;
				  	$scope.mensagem="Sem Mensagens";
			  	}
			  	
			  	
			  	
		  	
		  	})
		  	
		}  	
		  	
		  	
    }; 
    
    
    //=======================listagem pontos
    ListagemMapa.get(pessoa).then(function(data){
		console.log("Heyee");
		console.log(data);
		
		for(i=0;i<data.data.length;i++)
		{
			var pino={id:i,idempresa:data.data[i].idempresa,nomeempresa:data.data[i].empresa,imagem:data.data[i].imagem,latitude:data.data[i].latitude,longitude:data.data[i].longitude};
			$scope.pinos.push(pino);
		}
				
	});
	
	$rootScope.$on("actualizamapa", function(){
           console.log("vai acutalizar mapa");
	   $scope.pinos=[];
	   ListagemMapa.get(pessoa).then(function(data){
		console.log("Heyee");
		console.log(data);
		
		for(i=0;i<data.data.length;i++)
		{
			var pino={id:i,idempresa:data.data[i].idempresa,nomeempresa:data.data[i].empresa,imagem:data.data[i].imagem,latitude:data.data[i].latitude,longitude:data.data[i].longitude};
			$scope.pinos.push(pino);
		}
				
	   });
        });
	
	$rootScope.$on("recarregar", function(events, args){
		console.log("vai acutalizar mapa");
	   $scope.pinos=[];
	   ListagemMapa.get(pessoa).then(function(data){
		console.log("Heyee");
		console.log(data);
		
		for(i=0;i<data.data.length;i++)
		{
			var pino={id:i,idempresa:data.data[i].idempresa,nomeempresa:data.data[i].empresa,imagem:data.data[i].imagem,latitude:data.data[i].latitude,longitude:data.data[i].longitude};
			$scope.pinos.push(pino);
		}
				
	   });
	
	});
	
	
	//zoom
	console.log("hey dis"+$localstorage.getObject('pessoa').distancia);
	if($localstorage.getObject('pessoa').distancia>10000)
	{
		$scope.zoom=4;
	}
	else if ($localstorage.getObject('pessoa').distancia<10000 && $localstorage.getObject('pessoa').distancia>=1000) {
		$scope.zoom=8;
	}
	else if ($localstorage.getObject('pessoa').distancia<1000 && $localstorage.getObject('pessoa').distancia>=100) {
		$scope.zoom=12;
	}
	else if ($localstorage.getObject('pessoa').distancia<10 && $localstorage.getObject('pessoa').distancia<=100) {
		$scope.zoom=14;
	}
	else {
		$scope.zoom=16;
	}
	$rootScope.$on("actualizazoom", function(events, args){
		console.log("novo zoom");
			if(args>10000)
			{
				$scope.zoom=4;
			}
			else if (args<10000 && args>=1000) {
				$scope.zoom=8;
			}
			else if (args<1000 && args>=100) {
				$scope.zoom=12;
			}
			else if (args<10 && args<=100) {
				$scope.zoom=14;
			}
			else {
				$scope.zoom=16;
			}
			
        });
	
	
	$scope.favorito_func=function(){
	   
	   RegistarFavorito.set(pessoa,$scope.valorfavorito,username).then(function(state){
		  console.log($scope.valorfavorito);
		  var queryResult = angular.element(document.querySelector('#favorito'));
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
	
	
	$scope.share=function(){
		 $ionicLoading.show({
	      template: 'Espere um momento...'
	    });
		var options ;
				options = {
				  message: $scope.favorito_text, // not supported on some apps (Facebook, Instagram)
				  subject: 'UpAzores - '+ $scope.favorito_titulo, // fi. for email
				  files:[$scope.favorito_img],
				 /* url: 'https://www.website.com/foo/#bar?a=b',*/
				  chooserTitle: 'Escolha uma aplicação' // Android only, you can override the default share sheet title
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
				console.log($scope.clicado_latitude);
		
				 	var address=$scope.clicado_latitude+", "+$scope.clicado_longitude;
			        var url='';
			        if(ionic.Platform.isIOS()){
			            url="http://maps.apple.com/maps?q="+encodeURIComponent(address);
			        }else{
			            //this will be used for browsers if we ever want to convert to a website
			            url="http://maps.google.com?q="+encodeURIComponent(address);
			        }
		 window.open(url, "_system", 'location=no');

        
	}
	
	
	 
 })

.directive('markerClick', function() {
  
  return {
    restrict : 'A',
    

    link : function(scope, elem, attrs) {
     console.log(elem);

    elem.on('click', function() {
       // console.log('You clicked me!');
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
