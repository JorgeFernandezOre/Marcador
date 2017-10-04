var Twitter = require('twitter');
 
var client = new Twitter({
 consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});
 
exports.golEquipo=function (nombreEquipo){

      texto="Goooool del "+nombreEquipo+"!!!!!!";
       texto = texto.replace("del Real Sociedad", "de la Real Sociedad"); 

client.post('statuses/update', {status: texto})
  .then(function (tweet) {
    console.log(tweet);
  })
  .catch(function (error) {
    throw error;
  });
};






 exports.postResultado = function (nombreLocal,resultadoLocal,nombreVisitante,resultadoVisitante){

      resultado=nombreLocal+" ["+resultadoLocal+"-"+resultadoVisitante+"] "+ nombreVisitante;
client.post('statuses/update', {status: resultado})
  .then(function (tweet) {
    console.log(tweet);
  })
  .catch(function (error) {
    throw error;
  });
};

exports.golAnulado = function(nombreLocal,resultadoLocal,nombreVisitante,resultadoVisitante){

var mensaje="NO!!!! No ha sido gol! el resultado queda como antes: "+nombreLocal+" ["+resultadoLocal+"-"+resultadoVisitante+"] "+ nombreVisitante+" -- Disculpen las molestias.";

client.post('statuses/update', {status: mensaje})
  .then(function (tweet) {
    console.log(tweet);
  })
  .catch(function (error) {
    throw error;
  });
};

exports.cambioEstado = function(nombreLocal,resultadoLocal,nombreVisitante,resultadoVisitante,estado){
var mensaje="";
if(estado=="En Juego"){
mensaje= "Comienza el partido entre el "+nombreLocal+" y el "+nombreVisitante+"!!!!";
}
if(estado=="Finalizado"){
mensaje="Termina el "+nombreLocal+" y el "+nombreVisitante+" con el resultado de "+resultadoLocal+"-"+resultadoVisitante+"- Esperamos que hayan disfrutado de la retransmisión";


}
if(estado=="Suspendido"){
mensaje="¡¡¡Se ha suspendido el "+nombreLocal+" contra el "+nombreVisitante+" con el resultado de "+resultadoLocal+"-"+resultadoVisitante;

}
 mensaje = mensaje.replace("del Real Sociedad", "de la Real Sociedad"); 
  mensaje = mensaje.replace("el Real Sociedad", "la Real Sociedad"); 

client.post('statuses/update', {status: mensaje})
  .then(function (tweet) {
    console.log(tweet);
  })
  .catch(function (error) {
    throw error;
  });
};


