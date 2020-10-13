var express = require('express')
var app = express()

app.get('/', function (req, res) {
	// render ============> to views/index.ejs
	res.render('index', { titulo: 'My Node.js Application' })
})
/** 
 * Asignamos el objeto de la aplicación a module.exports
 * module.exports expone el objeto de la aplicación como un módulo
 * module.exports debe usarse para devolver el objeto 
 * cuando este archivo es necesario en otro módulo como app.js
 */
module.exports = app;