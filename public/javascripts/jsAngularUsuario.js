 

          var miAplicacionUser = angular.module( 'aplicacionResultados' , [] );
           
miAplicacionUser.factory('sockets', function ($rootScope) {
var socket = io.connect(window.location.origin);
    return {
        on: function (eventName, callback) {
        socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$applyAsync(function () {
            callback.apply(socket, args);
            });
        });
        },
 
    };
});
      
      
miAplicacionUser.controller ( 'controladorListaDePartidos' , [ '$scope' ,'$http','sockets', function($scope,$http,sockets){
 

    $http.get('/api/jornadaActual')
      .then(function(result) {


      $scope.partidos = result.data;

          
            });


$scope.jornadaAnterior = function (numeroJornadaActual){

if(numeroJornadaActual!=1){

   var jornada=parseInt($scope.partidos[0].numeroJornada);
   jornada--;
$http.get('/api/admin/partidosJornada/'+jornada).then(function(result) {
                        
                        var message=result.data;
                        //var message=JSON.parse(angular.toJson($scope.partidos))

                        $scope.partidos=message;
                    });
}
                    else{
                        alert("no se puede ir más atrás en la liga");
                    }


    
};

$scope.jornadaSiguiente = function (numeroJornadaActual){

if(numeroJornadaActual!=3){

   var jornada=parseInt($scope.partidos[0].numeroJornada);
   jornada++;
$http.get('/api/partidosJornada/'+jornada).then(function(result) {
                        
                        var message=result.data;
                        //var message=JSON.parse(angular.toJson($scope.partidos))

                        $scope.partidos=message;
                    });
}
                    else{
                        alert("no se puede ir más adelante en la liga");
                    }


    
};


    sockets.on('recibido', function(data) {
              $scope.partidos=data;

        });


} ] )