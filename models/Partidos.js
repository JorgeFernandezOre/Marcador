var mongoose = require('mongoose');

exports.PartidosSchema = new mongoose.Schema({
	numeroJornada: Number,
	numeroPartido: Number,
	nombreLocal:String,
	nombreVisitante: String, 
	golesLocal: {type: Number, default: 0},
	golesVisitante:{type: Number, default: 0}, 
	estadoPartido: {type: String, default:'No Comenzado'},
	fecha: { type: Date, default: Date.now }


});

