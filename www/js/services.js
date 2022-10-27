var inicio="https://upacores.pt/aplicacao/app/"

angular.module('starter.services', [])




.factory('GPSService',function($http,$rootScope,$ionicPopup){
      return {
        getcoordinates:function(){
                //===================== dados gps ios
               
                   var onSuccess = function(position) {
                   /* alert('Latitude: '          + position.coords.latitude          + '\n' +
                          'Longitude: '         + position.coords.longitude         + '\n' +
                          'Altitude: '          + position.coords.altitude          + '\n' +
                          'Accuracy: '          + position.coords.accuracy          + '\n' +
                          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                          'Heading: '           + position.coords.heading           + '\n' +
                          'Speed: '             + position.coords.speed             + '\n' +
                          'Timestamp: '         + position.timestamp                + '\n');*/
                    $rootScope.latitude=position.coords.latitude;
                    $rootScope.longitude=position.coords.longitude ;
                    
                   };
                   
                   // onError Callback receives a PositionError object
                   //
                   function onError(error) {
                   }
                    var options = { enableHighAccuracy: true};
                    var get_gps = navigator.geolocation.getCurrentPosition(onSuccess, onError,options);
                    console.log(navigator.geolocation);
                    navigator.geolocation.clearWatch(get_gps);
                     //fim gps android
                     return 'sucess';
        },
        getcoordinatesfast:function($scope){
                //===================== dados gps ios
               
                   var onSuccess = function(position) {
                   /* alert('Latitude: '          + position.coords.latitude          + '\n' +
                          'Longitude: '         + position.coords.longitude         + '\n' +
                          'Altitude: '          + position.coords.altitude          + '\n' +
                          'Accuracy: '          + position.coords.accuracy          + '\n' +
                          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                          'Heading: '           + position.coords.heading           + '\n' +
                          'Speed: '             + position.coords.speed             + '\n' +
                          'Timestamp: '         + position.timestamp                + '\n');*/
                    $rootScope.latitude=position.coords.latitude;
                    $rootScope.longitude=position.coords.longitude ;
                    
                   };
                   
                   // onError Callback receives a PositionError object
                   //
                   function onError(error) {
                    
                      
                       $scope.showAlert = function(texto) {
                                    var alertPopup = $ionicPopup.alert({
                                      title: 'GPS desativado',
                                      template: 'Por favor, ative o  GPS para poder obter as distâncias.',
                                      okText: 'OK', // String (default: 'OK'). The text of the OK button.
                                      okType: 'button-verde',
                                    });
                                    alertPopup.then(function(res) {
                                     ;
                                    });
                                  };
                     
                                 $scope.showAlert();
                    
                      
                     }
                    var options = { timeout: 1500,enableHighAccuracy: true};
                    var get_gps = navigator.geolocation.getCurrentPosition(onSuccess, onError,options);
                    console.log(navigator.geolocation);
                    navigator.geolocation.clearWatch(get_gps);
                 
        }   
      
    };
  
  
})
//**************registar pessoa ****/

.factory('CategoriasSeleccionadas', function($http) {
  
  var categorias=[];

  return {
    
    organizar: function(id) {
     		var i;
     		var encontrou=0;
     		for(i=0;i<categorias.length;i++)
     		{
	     		if(categorias[i]==id)
	     		{
		     		categorias.splice(i,1);
		     		encontrou=1;
		     		
	     		}
	     		
     		}
     		if(encontrou==0)
     		{
	     		categorias.push(id.toString());
     		}
     		
     		return categorias;  
    }
  };
})







//**************registar pessoa ****/

.factory('RegistarPessoa', function($http) {
  
  

  return {
    registar: function(nome,email,username,password) {
        return  $http.get(inicio+'registar_pessoa.php?nome='+nome+'&email='+email+'&username='+username+'&password='+password).then(function(resp) 		{
	        console.log('registar_pessoa.php?nome='+nome+'&email='+email+'&username='+username+'&password='+password);
                               return resp.data;
                  
        });

    }
  };
})

//**************login pessoa ****/

.factory('LoginPessoa', function($http) {
  
  

  return {
    login: function(username,password) {
        return  $http.get(inicio+'login.php?username='+username+'&password='+password).then(function(resp) 		{
	       
                               return resp.data;
                  
        });

    }
  };
})

/*************** obter categorias *******/

.factory('ListagemInteresses', function($http) {
  
  

  return {
    get: function() {
        return  $http.get(inicio+'listagem_interesses.php').then(function(resp) 
   		{
                               return resp.data;
                  
        });

    }
  };
})


//**************** obtem mensagens todas
.factory('ObterMensagens', function($http) {
  
  

  return {
    get: function(idcliente,offset) {
        return  $http.get(inicio+'listagem_mensagens.php?idcliente='+idcliente+'&start='+offset).then(function(resp) 
   		{
	   		console.log('listagem_mensagens.php?idcliente='+idcliente+'&start='+offset);
                               return resp.data;
                  
        });

    }
  };
})



//**************** obtem paginas bloqueadas 
.factory('ListagemBloqueados', function($http) {
  
  

  return {
    get: function(id) {
        return  $http.get(inicio+'listagem_bloqueados.php?cliente='+id).then(function(resp) 
   		{
                               return resp.data;
                  
        });

    }
  };
})


/*************** definir categorias que o user quer receber mensagens******************/


.factory('UpdateCategorias', function($http) {
  
  

  return {
    set: function(id,username,interesses) {
	    var string_array;
	    var i;
	    for(i=0;i<interesses.length;i++)
	    {
		    if(string_array)
			{
				 string_array=string_array+'&interesses[]='+interesses[i];
			}
			else
			{
				string_array='&interesses[]='+interesses[i];
			}
		   
		    
	    }
		console.log(string_array);
        return  $http.get(inicio+'update_interesses.php?idcliente='+id+'&username='+username+string_array).then(function(resp) 
   		{

                               return resp.data;
                  
        });

    }
  };
})

/*************** actualiza a localizacao da pessoa ******************/


.factory('UpdatePessoa', function($http) {
  
  

  return {
    set: function(id,username,latitude,longitude) {
	    var string_array;
	   
        return  $http.get(inicio+'update_pessoa.php?idcliente='+id+'&username='+username+'&latitude='+latitude+'&longitude='+longitude).then(function(resp) 
   		{
   							console.log('update_pessoa.php?idcliente='+id+'&username='+username+'&latitude='+latitude+'&longitude='+longitude);
                               return resp.data;
                  
        });

    }
  };
})

/*************** adiciona/remove dos favoritos ******************/


.factory('RegistarFavorito', function($http) {
  
  

  return {
    set: function(id,mensagem,username) {
	    var string_array;
	   
        return  $http.get(inicio+'favorito_mensagem.php?idcliente='+id+'&mensagem='+mensagem+'&username='+username).then(function(resp) 
   		{
	   		console.log(resp.data.data[0].state);
   				 return resp.data.data[0].state;
                  
        });

    }
  };
})

/*************** obtem favoritos  ******************/


.factory('ObtemFavoritos', function($http) {
  
  

  return {
    get: function(id,offset) {
	    var string_array;
	   
        return  $http.get(inicio+'listagem_favoritos.php?idcliente='+id+'&offset='+offset).then(function(resp) 
   		{
	   		
   				 return resp.data;
                  
        });

    }
  };
})


/*************** obtem coordenados  ******************/


.factory('ObtemCoords', function($http) {
  
  

  return {
    get: function(idempresa,idcliente) {
	    var string_array;
	   
        return  $http.get(inicio+'localizacao_perto.php?empresa='+idempresa+'&cliente='+idcliente).then(function(resp) 
   		{
	   		
   				 return resp.data;
                  
        });

    }
  };
})



/*************** regista telemovel ******************/


.factory('RegistarTelemovel', function($http) {
  
  

  return {
    set: function(id,udid) {
	    var string_array;
	   
        return  $http.get(inicio+'registar_telemovel.php?idcliente='+id+'&udid='+udid).then(function(resp) 
   		{
	   		console.log('registar_telemovel.php?idcliente='+id+'&udid='+udid);
   				 return resp.data;
                  
        });

    }
  };
})

/*************** obter pontos *******/

.factory('ListagemMapa', function($http) {
  
  

  return {
    get: function(idcliente) {
        return  $http.get(inicio+'listagem_sitios.php?idcliente='+idcliente).then(function(resp) 
   		{
                               return resp.data;
                  
        });

    }
  };
})


/*************** ultima mensagem *******/

.factory('UltimaMensagem', function($http) {
  
  

  return {
    get: function(idempresa,pessoa) {
        return  $http.get(inicio+'ultima_mensagem.php?idempresa='+idempresa+'&idcliente='+pessoa).then(function(resp) 
   		{
                               return resp.data;
                  
        });

    }
  };
})


/*************** sitio obter *******/

.factory('ObterSitio', function($http) {
  
  

  return {
    get: function(idempresa) {
        return  $http.get(inicio+'sitio.php?idsitio='+idempresa).then(function(resp) 
   		{
                               return resp.data;
                  
        });

    }
  };
})




/*************** obter_mensagens sitio *******/

.factory('SitioMensagens', function($http) {
  
  

  return {
    get: function(idempresa,start,pessoa) {
        return  $http.get(inicio+'listagem_mensagems_sitio.php?idempresa='+idempresa+'&start='+start+'&idcliente='+pessoa).then(function(resp) 
   		{
                               return resp.data;
                  
        });

    }
  };
})


/*************** obter_mensagens sitio *******/

.factory('Getidempresa', function($http) {
  
  

  return {
    get: function(mensagem) {
        return  $http.get(inicio+'get_idempresa.php?mensagem='+mensagem).then(function(resp) 
   		{
                               return resp.data;
                  
        });

    }
  };
})



/*************** regista telemovel ******************/


.factory('UpdateInteresse', function($http) {
  
  

  return {
    set: function(id,username,interesse) {
	    var string_array;
	   
        return  $http.get(inicio+'update_interesse.php?idcliente='+id+'&username='+username+'&interesses='+interesse).then(function(resp) 
   		{
	   		
   				 return resp.data;
                  
        });

    }
  };
})



/*************** update distancia  ******************/


.factory('Updatedistancia', function($http) {
  
  

  return {
    set: function(id,username,distancia) {
	    var string_array;
	   
        return  $http.get(inicio+'update_distancia.php?idcliente='+id+'&username='+username+'&distancia='+distancia).then(function(resp) 
   		{
	   		 return resp.data;
                  
        });

    }
  };
})


/*************** bloquear pagina  ******************/


.factory('Bloquearpagina', function($http) {
  
  

  return {
    set: function(id,username,pagina) {
	    var string_array;
	   
        return  $http.get(inicio+'bloquear_pagina.php?idcliente='+id+'&username='+username+'&pagina='+pagina).then(function(resp) 
   		{
	   		 return resp.data;
                  
        });

    }
  };
})

/*************** compoem dados ******************/


.factory('Fixlocal', function() {
  
  var elemento;

  return {
    fix: function(user,data) {
	    
	    
       		console.log(user);
	   		elemento={"idcliente":user.idcliente,"username":user.username,"email":user.email,"nome":user.nome,"distancia":user.distancia,"categorias":data.categorias};
       
        
			return elemento;
    },
    fixcategorias:function(user,data) {
	    
	    var exists=-1;
	     for(i=0;i<user.categorias.length;i++)
	     {
		     if(user.categorias[i]==data)
		     {
			     exists=i;
		     }
	     }
	    console.log(exists);
	    if(exists>-1)
	    {
		    user.categorias.splice(exists,1);
		    
	    }
	    else
	    {
		    user.categorias.push(data.toString());
		    
	    }
	    	elemento={"idcliente":user.idcliente,"username":user.username,"email":user.email,"nome":user.nome,"distancia":user.distancia,"categorias":user.categorias};
			return elemento;
    },
    distancia:function(user,distancia)
    {
	    
	    elemento={"idcliente":user.idcliente,"username":user.username,"email":user.email,"nome":user.nome,"distancia":distancia,"categorias":user.categorias};
			return elemento;
    }

  };
})



/*************** nova password *******/

.factory('RemoverUser', function($http) {
  
  

  return {
    put: function(idpessoa,nome) {
        return  $http.get(inicio+'remover_perfil.php?id='+idpessoa+'&nome='+nome).then(function(resp) 
   		{
	   		
	   		      console.log(resp);
                               return resp.data;
                  
        });

    }
  };
})



/*************** nova password *******/

.factory('Password', function($http) {
  
  

  return {
    put: function(idpessoa,username,pass) {
        return  $http.get(inicio+'nova_password.php?idcliente='+idpessoa+'&username='+username+'&password='+pass).then(function(resp) 
   		{
	   		
	   		console.log('nova_password.php?idcliente='+idpessoa+'&username='+username+'&password='+pass);
	   			   		console.log(resp);
                               return resp.data;
                  
        });

    }
  };
})

/*************** recuperar password *******/

.factory('Password', function($http) {
  
  

  return {
    get: function(mail) {
        return  $http.get(inicio+'recuperar_password.php?email='+mail).then(function(resp) 
   		{
	   		
	   		
	   			   		console.log(resp);
                               return resp.data;
                  
        });

    }
  };
})


.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
;


