
//Dependencias

var express = require('express');
var http = require('http');
var path = require('path');
var socketio = require('socket.io')();
var routes = require('./routes/index.js');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
 var conexion = require('./models/conexion');
var masterUser='username';
var masterPass='password';
//var fs = require('fs');
//var server = http.createServer(app);



//Configuramos el servidor

app.use(express.json());
app.use(express.urlencoded());
app.set('port', process.env.PORT || 8080);
var server = app.listen(app.get('port'));
app.use(express.static(path.join(__dirname, 'public')));

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(app.router);
app.use(express.urlencoded());
app.use(express.methodOverride());

//configuramos la autentificacion
var auth = express.basicAuth(masterUser,masterPass)


//Creamos el servidor

server.listen(app.get('port'), function(){
  console.log('Servidor Express escuchando en el puerto ' + app.get('port'));
});


//Rutas para el navegador

//La del administrador
app.get('/admin123',auth, function (req, res) {
	res.sendfile('./public/admin32632.html');
});

//La del usuario
app.get('/user', function (req, res) {
	res.sendfile('./public/user.html');
});


//
//Comenzamos Socket.io
//
var io = socketio.listen(server);

io.on('connection', function(socket){

    console.log('usuario conectado' );

   socket.on('send:message', function (data) {
      console.log(data);
      io.sockets.emit('recibido', data);
  });
}); 


//API de MongoDB
app.get('/api/partidosJornada/:jornada',routes.partidosJornada);
app.get('/api/admin/partidosJornada/:jornada',routes.partidosJornadaAdmin);
app.get('/api/admin/partido/:id',routes.partidoIndividual);
app.get('/api/todosPartidos',routes.todosPartidos);
app.get('/api/admin/jornadaActual',routes.jornadaActualAdmin);
app.get('/api/jornadaActual',routes.partidosJornadaActual);
app.post('/api/restarlocalgol/:id',routes.restarGolLocal);
app.post('/api/restarvisitantegol/:id',routes.restarGolVisitante);
app.post('/api/addPartidos', routes.aniadirPartidos);
app.post('/api/addPartido', routes.aniadirPartido);
app.post('/api/localgol/:id',routes.golLocal);
app.post('/api/visitantegol/:id',routes.golVisitante);
app.delete('/api/borrarPartido/:id',routes.borrarPartido);
app.put('/api/actualizarPartido/:id/:estado',routes.actualizarPartido);

