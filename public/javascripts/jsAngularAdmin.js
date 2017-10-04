 
  var miAplicacion = angular.module( 'aplicacionResultadosAdmin' , [] );
          
 
miAplicacion.factory('sockets', function ($rootScope) {
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
        emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$applyAsync(function () {
            if (callback) {
                callback.apply(socket, args);
            }
            });
        })
        }
    };
});
   

miAplicacion.controller ( 'controladorListaDePartidosAdmin' , [ '$scope' ,'$http','sockets', function($scope,$http,sockets){

    $scope.partidos = [];
    
    $scope.estados = [
        {nombreEstado : "No Comenzado"},
        {nombreEstado : "En Juego"},
        {nombreEstado : "Suspendido"},
        {nombreEstado : "Finalizado"}
    ];


    $http.get('/api/admin/jornadaActual').then(function(result) {

        $scope.partidos = result.data;

        
    });


    $scope.cambioEstadoPartido=function(id,estado){
        if (confirm("¿Desea actualizar el estado del partido?") == true) {
    
            var url='/api/actualizarPartido/'+id+'/'+estado;
             $http.put(url);
                    
            $http.get('/api/admin/partidosJornada/'+$scope.partidos[0].numeroJornada).then(function(result) {
                var message=result.data;
                //var message=JSON.parse(angular.toJson($scope.partidos))

                sockets.emit('send:message', message);

                alert('partido actualizado a '+estado);
            });

        };
    }
   

    $scope.sumarGolLocal= function(id,estado){
        if(estado=="En Juego"){
            if (confirm("¿Desea sumar un gol al equipo local?") == true) {

            var url = '/api/localgol/'+id;
            $http.post(url);

                    $http.get('/api/admin/partidosJornada/'+$scope.partidos[0].numeroJornada)
                    .then(function(result) {

                        var message=result.data;
                        //var message=JSON.parse(angular.toJson($scope.partidos)) //Para eliminar el campo $$hash

                        sockets.emit('send:message', message);

                        });
            alert('Ha marcado un gol es equipo local ');}
        }



        else{
            alert("no se pueden marcar goles en un partido que no está en juego");
        }

    }

    sockets.on('recibido', function(data) {
         $scope.partidos=data;
    });


    $scope.sumarGolVisitante= function(id,estado){
        if(estado=="En Juego"){
            if (confirm("¿Desea sumar un gol al equipo visitante?") == true) {

            var url = '/api/visitantegol/'+id;
            $http.post(url);

                    $http.get('/api/admin/partidosJornada/'+$scope.partidos[0].numeroJornada)
                    .then(function(result) {

                        var message=result.data;
                        //var message=JSON.parse(angular.toJson($scope.partidos)) //Para eliminar el campo $$hash

                        sockets.emit('send:message', message);

                        });
            alert('Ha marcado un gol el equipo visitante ');}
        }



        else{
            alert("no se pueden marcar goles en un partido que no está en juego");
        }

    }

    sockets.on('recibido', function(data) {
         $scope.partidos=data;
    });


       $scope.restarGolLocal=function(id,estado,golLocal){

               if(estado=="En Juego" && golLocal!=0){

                if (confirm("¿Desea restarle un gol al equipo local?") == true) {
                    var url = '/api/restarlocalgol/'+id;
                    $http.post(url);
                    $http.get('/api/admin/partidosJornada/'+$scope.partidos[0].numeroJornada).then(function(result) {
                        
                        var message=result.data;
                        //var message=JSON.parse(angular.toJson($scope.partidos))

                        sockets.emit('send:message', message);
                    });

                    alert('Se le ha restado un gol es equipo local ');

                }
        }
        
        else{
            if(estado!="En Juego"){
                alert("no se pueden quitar goles en un partido que no está en juego");
            }
            if(golLocal==0 && estado=="En Juego" ){
                                        console.log(golLocal);

            alert('no pueden haber resultados negativos');
            }    
    }
    }

$scope.restarGolVisitante=function(id,estado,golVisitante){

                             if(estado=="En Juego" && golVisitante!=0){

                if (confirm("¿Desea restarle un gol al equipo visitante?") == true) {
                    var url = '/api/restarvisitantegol/'+id;
                    $http.post(url);
                    $http.get('/api/admin/partidosJornada/'+$scope.partidos[0].numeroJornada).then(function(result) {
                        
                        var message=result.data;
                        //var message=JSON.parse(angular.toJson($scope.partidos))

                        sockets.emit('send:message', message);
                    });

                    alert('Se le ha restado un gol es equipo local ');

                }
        }
        
        else{
            if(estado!="En Juego"){
                alert("no se pueden quitar goles en un partido que no está en juego");
            }
            if(golVisitante==0 && estado=="En Juego"){
                                        console.log(golVisitante);

            alert('no pueden haber resultados negativos');
            }    
    }
    }

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
$http.get('/api/admin/partidosJornada/'+jornada).then(function(result) {
                        
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
          