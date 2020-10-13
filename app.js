var express = require('express')
var app = express()

var expressMongoDb = require('express-mongo-db');
var config = require('./config')


app.use(expressMongoDb(config.database.url));
app.set('view engine', 'ejs');


/**
 * import routes/index.js
 * import routes/users.js
 */ 
var index = require('./routes/index');
var users = require('./routes/users');


/**
 * Express Validator Middleware para formulario validacion
 */ 
var expressValidator = require('express-validator');
app.use(expressValidator());


/**
 * El módulo body-parser se usa para leer datos HTTP POST
 * es un middleware expreso que lee la entrada del formulario 
 * y almacenarlo como objeto javascript
 */ 
var bodyParser = require('body-parser');

/**
 * bodyParser.urlencoded () analiza el texto como datos codificados en URL 
 * (que es como los navegadores tienden a enviar datos de formularios desde formularios regulares configurados en POST) 
 * y expone el objeto resultante (que contiene las claves y los valores) en req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Este módulo nos permite usar verbos HTTP como PUT o DELETE 
 * en lugares donde no son compatibles
 */ 
var methodOverride = require('method-override');

/**
 * usando lógica personalizada para anular el método 
 * también hay otras formas de anular
 * como usar el encabezado y usar el valor de la consulta
 */ 

app.use(methodOverride(function (req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
	  // buscar en urlencoded POST codificados en URL y eliminarlo
	  var method = req.body._method
	  delete req.body._method
	  return method
	}
  }))

/**
 * Este módulo muestra mensajes flash
 * generalmente se usa para mostrar mensajes de éxito o error
 * Los mensajes flash se almacenan en sesión
 * Entonces, también tenemos que instalar y usar 
 * módulos de sesión y analizador de cookies
 */ 

var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())

app.use('/', index)
app.use('/users', users)

app.listen(3000, function(){
	console.log('Servidor escuchando en puerto 3000');
	console.log('http://127.0.0.1:3000')
	console.log('Welcome to my home');
})