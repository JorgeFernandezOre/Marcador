// Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
 var conexion = require('../models/conexion');
 var twitter = require('../modules/twitter.js');
 
 var jornadaActual = 2;

var PartidosSchema = require('../models/Partidos').PartidosSchema;
var Match =conexion.db.model('partidos', PartidosSchema);



//Añadir un partido

exports.aniadirPartido = function (req, res) {


console.log('POST');

	var match = new Match ({
		"numeroJornada":	req.body.numeroJornada,
        "numeroPartido":    req.body.numeroPartido,
        "nombreLocal":     req.body.nombreLocal,
        "nombreVisitante":  req.body.nombreVisitante,
        "golesLocal":   req.body.golesLocal,
        "golesVisitante":  req.body.golesVisitante,
        "estadoPartido":  req.body.estadoPartido
    });

    match.save(function(err, match) {
        if(err) return res.status(500).send( err.message);
    res.status(200).jsonp(match);
    });

};

//GET - Devuelve todos los partidos de la BD
exports.todosPartidos = function(req, res) {  
    Match.find(function(err, partidos) {
    if(err) res.send(500, err.message);

    console.log('GET /partidos')
        res.status(200).jsonp(partidos);
    });
};

//GET - coger todos los partidos de una jornada para el ADMINISTRADOR
exports.partidoIndividual = function(req, res) {  

req.params.jornada=parseInt(req.params.jornada);
	
    Match.find( {"_id": req.params.id }, function(err, partido) {
    if(err) res.send(500, err.message);

    console.log('GET /jornada')
        res.status(200).jsonp(partido);
    });
};


		//POST - Añadir un gol al equipo local y postearlo en twitter
exports.golLocal = function(req, res) {  
    Match.findById(req.params.id, function(err, partido) {

        partido.golesLocal  = partido.golesLocal+1;

        partido.save(function(err) {
            if(err) return res.status(500).send(err.message);
      res.status(200).jsonp(partido);


		twitter.golEquipo(partido.nombreLocal);
		twitter.postResultado(partido.nombreLocal,partido.golesLocal,partido.nombreVisitante,partido.golesVisitante);

        });
    });
};


//Añadir múltiples partidos
exports.aniadirPartidos= function(req, res) {

// Array of JSON Objects
if (req.body.partidos){
  Match.create(req.body.partidos, function(err){
    if(err)
      res.send(err);

    else
      res.json(req.body);
  });
};
};


		//POST - Añadir un gol al equipo visitante y postearlo en twitter

exports.golVisitante = function(req, res) {  
    Match.findById(req.params.id, function(err, partido) {
	        partido.golesVisitante  = partido.golesVisitante+1;
        partido.save(function(err) {
            if(err) return res.status(500).send(err.message);
      	res.status(200).jsonp(partido);
				
				
		twitter.golEquipo(partido.nombreVisitante);
		twitter.postResultado(partido.nombreLocal,partido.golesLocal,partido.nombreVisitante,partido.golesVisitante);

        });
    });
};



//GET - coger todos los partidos de una jornada para el ADMINISTRADOR (con el id)
exports.partidosJornadaAdmin = function(req, res) {  

req.params.jornada=parseInt(req.params.jornada);
	
    Match.find({"numeroJornada": req.params.jornada }, function(err, partidos) {
    if(err) res.send(500, err.message);

    console.log('GET /jornada')
        res.status(200).jsonp(partidos);
    });
};



//GET - coger todos los partidos de una jornada para el USUARIO
exports.partidosJornada = function(req, res) {  

req.params.jornada=parseInt(req.params.jornada);
	
    Match.find( {"numeroJornada": req.params.jornada },{ _id: 0 }, function(err, partidos) {
    if(err) res.send(500, err.message);

    console.log('GET /jornada')
        res.status(200).jsonp(partidos);
    });
};




//Borrar partido
exports.borrarPartido = function(req, res) {  
    Match.findById(req.params.id, function(err, partido) {
        partido.remove(function(err) {
            if(err) return res.status(500).send(err.message);
      res.status(200).send();
        })
    });
};


//PUT - Actualizar un partido existente
exports.actualizarPartido = function(req, res) {  
    Match.findById(req.params.id, function(err, partido) {
        partido.estadoPartido = req.params.estado;

        partido.save(function(err) {
            if(err) return res.status(500).send(err.message);
      res.status(200).jsonp(partido);
              twitter.cambioEstado(partido.nombreLocal,partido.golesLocal,partido.nombreVisitante,partido.golesVisitante,partido.estadoPartido);

        });
    });
};

//Coge los partidos de la jornada actual para el Admin
exports.jornadaActualAdmin = function(req, res) {  


    Match.find({"numeroJornada": jornadaActual }, function(err, partidos) {
    if(err) res.send(500, err.message);

    console.log('GET /jornada')
        res.status(200).jsonp(partidos);
    });
};

//Coge los partidos de la jornada actual para el usuario
exports.partidosJornadaActual = function(req, res) {  

	
    Match.find( {"numeroJornada": jornadaActual },{ _id: 0 }, function(err, partidos) {
    if(err) res.send(500, err.message);

    console.log('GET /jornada')
        res.status(200).jsonp(partidos);
    });
};

//POST - RESTAR GOL LOCAL
exports.restarGolLocal = function(req, res) {  
    Match.findById(req.params.id, function(err, partido) {

        partido.golesLocal  = partido.golesLocal-1;
console.log(partido.golesLocal);
        partido.save(function(err) {
            if(err) return res.status(500).send(err.message);
      res.status(200).jsonp(partido);


		//twitter.golEquipo(partido.nombreLocal);
		twitter.golAnulado(partido.nombreLocal,partido.golesLocal,partido.nombreVisitante,partido.golesVisitante);

        });
    });
};

//POST - RESTAR GOL VISITANTE

exports.restarGolVisitante = function(req, res) {  
    Match.findById(req.params.id, function(err, partido) {

        partido.golesVisitante--;
        partido.save(function(err) {
            if(err) return res.status(500).send(err.message);
      res.status(200).jsonp(partido);


		twitter.golAnulado(partido.nombreLocal,partido.golesLocal,partido.nombreVisitante,partido.golesVisitante);

        });
    });
};