angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$window,$ionicModal, $timeout,$state,ListagemInteresses,$localstorage,ListagemBloqueados,UpdateInteresse,Fixlocal,Updatedistancia,$rootScope,$ionicPopup,Bloquearpagina,Password,RemoverUser,$ionicHistory,$ionicLoading) {
	
	$scope.menu;
		
	
	var pessoa = $localstorage.getObject('pessoa');
	function isNumeric(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}
	$scope.distancia=[];
	$scope.pessoa_user=isNumeric(pessoa.username) ?  pessoa.nome  : pessoa.username;
	$scope.pessoa_email=pessoa.email;
	$scope.pessoa_distancia=pessoa.distancia;
	if($scope.pessoa_user)
	{
		$scope.menu=true;
		
	}
	else
	{
		$scope.menu=false;
	}

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
	$scope.pessoa_user=isNumeric(pessoa.username) ?  pessoa.nome  : pessoa.username;
	$scope.pessoa_email=pessoa.email;
	$scope.pessoa_distancia=pessoa.distancia;
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  $scope.favoritos=function(){
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go('app.favoritos');
  }
  $scope.geral=function(){
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go('app.geral');
  }
  $scope.mapa=function(){
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go('app.mapa');
  }
  
  $scope.muda_opcao=function(id_op){
	
	
		$ionicLoading.show({
		      template: 'Por favor espere...'
		});
	$localstorage.setObject('pessoa',Fixlocal.fixcategorias(pessoa,id_op));
	
		
		 
		UpdateInteresse.set(pessoa.idcliente,pessoa.username,id_op).then(function(data){
			 $ionicLoading.hide();
			$rootScope.$emit("actualiza_mensagens",{});
			$rootScope.$emit("actualizamapa", {});				
				  
		});
		
		
	
	  
  }
  
  
  
  
  
  
  //listagem lateral das categorias
  $scope.listagem_categorias=[];
  ListagemInteresses.get().then(function(data){
	  var i;
	  
	  for(i=0;i<data.data.length;i++)
	  {
			if(pessoa.categorias.indexOf(data.data[i].idinteresse) >= 0)
			{
				$scope.listagem_categorias.push({'idinteresse':data.data[i].idinteresse,'nomeinteresse':data.data[i].nomeinteresse,'selecionado':true});
				console.log("aqui2");
			}
			else
			{
								$scope.listagem_categorias.push({'idinteresse':data.data[i].idinteresse,'nomeinteresse':data.data[i].nomeinteresse,'selecionado':false});
								console.log("aqui");

			}
			
	  }
	 
	 
  });
  
  
  $rootScope.$on('actualiza', function(event, args) {
	  console.log("vim aqui");
	  $scope.listagem_categorias=[];
	  var i;
	  ListagemInteresses.get().then(function(data){
		  var i;
		  
		  
		  for(i=0;i<data.data.length;i++)
		  {
				if(pessoa.categorias.indexOf(data.data[i].idinteresse) >= 0)
				{
					$scope.listagem_categorias.push({'idinteresse':data.data[i].idinteresse,'nomeinteresse':data.data[i].nomeinteresse,'selecionado':true});
				}
				else
				{
									$scope.listagem_categorias.push({'idinteresse':data.data[i].idinteresse,'nomeinteresse':data.data[i].nomeinteresse,'selecionado':false});
	
				}
				
		  }
		  
		 
	  });
  });
  
  $scope.bloqueados=[];
  //listagem lateral do sconteudos bloqueados
  ListagemBloqueados.get(pessoa.idcliente).then(function(data){
	  $scope.bloqueados=data.data;	  
  });
  $rootScope.actualiza=function(){
	  	$scope.bloqueados=[];
	 	 ListagemBloqueados.get(pessoa.idcliente).then(function(data){
	 	 	$scope.bloqueados=data.data;	  
  		});
  }
  
  
  //=================desbloquear
  
  
  $scope.desbloquear=function(data)
  {
	  
	  
	  var confirmPopup = $ionicPopup.confirm({
	     title: 'Alerta',
	     template: 'Tens a certeza que queres desbloquear a página?'
	   });
	
	   confirmPopup.then(function(res) {
	     if(res) {
		   Bloquearpagina.set(pessoa.idcliente,pessoa.username,data).then(function(data2){
			   console.log(data2);
		       	  for(i=0;i<$scope.bloqueados.length;i++)
				  {
					  if($scope.bloqueados[i].id==data)
					  {
						  $scope.bloqueados.splice(i,1);
					  }
					  
				  }
				$rootScope.$broadcast("recarregar", {});
	       })
	       
	     } else {
	       console.log('You are not sure');
	     }
	   });
	   
	   
	   
	  console.log(data);
	  
	  
  }
  
  
  
  //============ distancia nova ===============
  $scope.distancia_nova=function(){
	  
	  var dis=$scope.distancia.value;
		  
        $localstorage.setObject('pessoa',Fixlocal.distancia(pessoa,dis.toString()));
        console.log(pessoa);
        Updatedistancia.set(pessoa.idcliente,pessoa.username,dis).then(function(data){
	        console.log($scope.distancia.value);
	        $rootScope.$broadcast("actualizazoom", dis);
		$rootScope.$broadcast("recarregar", {});
		
        });
        /*
	   $timeout(function(){
		   console.log($scope.distancia.value);
		  
        
        
     }, 000);*/
  }
  
  $scope.delete_profile=function(){
	var myPopup = $ionicPopup.show({
	    template: 'Tem a certeza de que quer remover o seu perfil?',
	    title: '<span>Aviso</span>',
	    subTitle: '',
	    scope: $scope,
	    buttons: [
	      { text: 'Não' },
	      {
	        text: '<b>Sim</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	              RemoverUser.put(pessoa.idcliente,pessoa.email).then(function(data2){
				if(data2.data=="1")
				{
					$localstorage.setObject('pessoa', {
						idcliente: 0
					      });
					$ionicHistory.clearCache();
					$ionicHistory.clearHistory();
					 setTimeout(function (){
						$window.location.reload(true);
					 }, 100);
					$state.go('land');
					 setTimeout(function (){
						$window.location.reload(true);
					 }, 100);
				}
			})
		     
	        }
	      }
	    ]
	  });
  }
  
  
  //================ actualizar password
  $scope.novapassword=function(){
	  
	  $scope.data2 = {};

	  // An elaborate, custom popup
	  var myPopup = $ionicPopup.show({
	    template: '<input type="password" ng-model="data2.password">',
	    title: 'Nova palavra‐passe',
	    subTitle: 'Escrever a nova palavra‐passe no campo a baixo:',
	    scope: $scope,
	    buttons: [
	      { text: 'Cancelar' },
	      {
	        text: '<b>Salvar</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	          if (!$scope.data2.password) {
		    //don't allow the user to close unless he enters wifi password
	            e.preventDefault();
	          } else {
		         return $scope.data2.password;
	            
	          }
	        }
	      }
	    ]
	  });
	
	  myPopup.then(function(res) {
	     Password.put(pessoa.idcliente,pessoa.username,$scope.data2.password).then(function(data){
		
				        console.log(data);
				          //return data;
		 });
		          
	  });
	  }
  
  
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.directive('clicado', function($compile) {
  var descricao_open=false;
  return {
    restrict : 'EA',
    

    link : function(scope, elem, attrs) {
   

    elem.on('click', function() {
    	 console.log(elem);
	 console.log(attrs);
	 console.log(scope);
	 
	if(attrs.clicado=="mapa")
	{
		
		
		
		var  mapa= angular.element(document.getElementById('bt2_menu'));
		mapa.addClass("botao_menu_seleccionado");
		$compile(mapa)(scope);
		var  favoritos= angular.element(elem[0].querySelector('#bt1_menu'));
		favoritos.addClass("botao_menu_seleccionado");
		
		
		
	}
	
	
     });
    
      /*
       *var favoritos = elem[0].querySelector('#bt1_menu"');
		favoritos.removeClass("botao_menu_seleccionado");
		var  mapa= angular.elem(elem[0].querySelector('#bt2_menu"'));
		mapa.addClass("botao_menu_seleccionado");
       *else if(attrs.clicado=="favoritos")
	{
		var favoritos = angular.element(elem[0].querySelector('#bt1_menu"'));
		angular.element(favoritos).addClass("botao_menu_seleccionado");
		var  mapa= angular.element(elem[0].querySelector('#bt2_menu"'));
		queryResult.removeClass("botao_menu_seleccionado");
	}
	else
	{
		var favoritos = angular.element(elem[0].querySelector('#bt1_menu"'));
		angular.element(favoritos).removeClass("botao_menu_seleccionado");
		var  mapa= angular.element(elem[0].querySelector('#bt2_menu"'));
		queryResult.removeClass("botao_menu_seleccionado");
	}
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

