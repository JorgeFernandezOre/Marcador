//CONEXIÓN A LA BASE DE DATOS


//Conectamos a la base de datos local

var mongoose = require('mongoose');
var db;

if (process.env.VCAP_SERVICES) {
   var env = JSON.parse(process.env.VCAP_SERVICES);
   db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else {
   db = mongoose.createConnection('mongodb://localhost/liga');
}

//Exportamos la conexión
exports.db = db;