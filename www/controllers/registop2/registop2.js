angular.module('starter.registop2', [])

.controller('Registop2Ctrl', function($scope, $ionicModal,$timeout,$state,$ionicViewSwitcher,ListagemInteresses,$localstorage,CategoriasSeleccionadas,Fixlocal,UpdateCategorias,$rootScope,$ionicPopup) {
	
	//as categorias que as pessoas escolhem estao representadas pelo model $scope.categorias
	$scope.categorias=[];
	$scope.categorias_escolhidas=[];
	ListagemInteresses.get().then(function(data){
		$scope.categorias=data.data;
	
	})
	

	
	
	/*
	/*{id:1,nome:"Actividade ar livre",img:"img/iconestrelafundopreto.png"},{id:2,nome:"teste",img:"img/iconestrelafundopreto.png"},{id:3,nome:"teste",img:"img/iconestrelafundopreto.png"},{id:4,nome:"teste",img:"img/iconestrelafundopreto.png"}
	];
*/
	$scope.complete_registo=function(){
		
		if($scope.categorias_escolhidas.length>2)
		{
					console.log("sucesso");
					
					var dados=$localstorage.getObject('pessoa');
		
					$localstorage.setObject('pessoa',Fixlocal.fix(dados,{categorias:$scope.categorias_escolhidas}));
		
					UpdateCategorias.set(dados.idcliente,dados.username,$scope.categorias_escolhidas).then(function(data){
						console.log(data);
						$state.go('app.geral');
					});				
		
		}
		else{
			$ionicPopup.alert({
		     title: 'Aviso',
		     template: 'Selecione 3 ou mais categorias'
		   });
			
		}
		
		   
		
		
	}
	$scope.select=function(id){

		$scope.categorias_escolhidas=CategoriasSeleccionadas.organizar(id);
		//$scope.categorias_escolhidas=CategoriasSeleccionadas.adicionar(id);
		console.log($scope.categorias_escolhidas);

		
		
		
		
	}

 })

.directive('iconSwitcher', function() {
  
  return {
    restrict : 'A',
    
    link : function(scope, elem, attrs) {
      
      var currentState = true;
      
      elem.on('click', function() {
        //console.log('You clicked me!');
        
        if(currentState === true) {
          //console.log('It is on!');
          angular.element(elem).removeClass(attrs.onIcon);
          angular.element(elem).addClass(attrs.offIcon);
        } else {
          //console.log('It is off!');
          angular.element(elem).removeClass(attrs.offIcon);
          angular.element(elem).addClass(attrs.onIcon);
        }
        
        currentState = !currentState

      });
      
      
    }
  };
}); 