var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF USERS
app.get('/', function (req, res, next) {
    // buscar y ordenar la colección de usuarios por id en orden descendente
    req.db.collection('users').find().sort({ "_id": -1 }).toArray(function (err, result) {
        //if (err) return console.log(err)
        if (err) {
            req.flash('error', err)
            res.render('user/list', {
                titulo: 'User List',
                data: ''
            })
        } else {
            // render ============> views/user/list.ejs template file
            res.render('user/list', {
                titulo: 'User List',
                data: result
            })
        }
    })
})

// SHOW ADD USER FORM
app.get('/add', function (req, res, next) {
	// render ============> views/user/add.ejs
	res.render('user/add', {
		titulo: 'Agregar nuevo usuario',
		nombre: '',
		edad: '',
		email: ''
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function (req, res, next) {
	req.assert('nombre', 'Se requiere el Nombre').notEmpty()         
	req.assert('edad', 'Se requiere la Edad').notEmpty()             
	req.assert('email', 'Se requiere un mail valido').isEmail()  

	var errors = req.validationErrors()

	if (!errors) {

		var user = {
			nombre: req.sanitize('nombre').escape().trim(),
			edad: req.sanitize('edad').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}

		req.db.collection('users').insert(user, function (err, result) {
			if (err) {
				req.flash('error', err)

				// render ============> to views/user/add.ejs
				res.render('user/add', {
					titulo: 'Agregar nuevo usuario',
					nombre: user.nombre,
					edad: user.edad,
					email: user.email
				})
			} else {
				req.flash('success', 'Se agrego el usuario exitosamente')
				// redirect to user list page				
				res.redirect('/users')
			}
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		/**
		 * Usando req.body.nombre 
		 * porque req.param('nombre') es deprecated
		 */
		res.render('user/add', {
			titulo: 'Agregar nuevo usuario',
			nombre: req.body.nombre,
			edad: req.body.edad,
			email: req.body.email
		})
	}
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function (req, res, next) {
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').find({ "_id": o_id }).toArray(function (err, result) {
		if (err) return console.log(err)
		// si user no se encuentra
		if (!result) {
			req.flash('error', `Usuario no encontrado con el id: ${req.params.id}`)
			res.redirect('/users')
		}
		else { // si user se encuentra
			// render ============> views/user/edit.ejs
			res.render('user/edit', {
				titulo: 'Editar usuario',
				//data: rows[0],
				id: result[0]._id,
				nombre: result[0].nombre,
				edad: result[0].edad,
				email: result[0].email
			})
		}
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function (req, res, next) {
	var o_id = new ObjectId(req.params.id)
    // validando
	req.assert('nombre', 'Se requiere el Nombre').notEmpty()         
	req.assert('edad', 'Se requiere la Edad').notEmpty()             
	req.assert('email', 'Se requiere un mail valido').isEmail()  

	var errors = req.validationErrors()

	if (!errors) {  
        
		var user = {
			nombre: req.sanitize('nombre').escape().trim(),
			edad: req.sanitize('edad').escape().trim(),
			email: req.sanitize('email').escape().trim()
		}

		var o_id = new ObjectId(req.params.id)
		req.db.collection('users').update({ "_id": o_id }, user, function (err, result) {
			if (err) {
				req.flash('error', err)
				// render ============> views/user/edit.ejs
				res.render('user/edit', {
					titulo: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					age: req.body.age,
					email: req.body.email
				})
			} else {
				req.flash('success', `Se actualizo con exito el usuario id${req.params.id}!`)
				res.redirect('/users')
			}
		})
	}
	else {   //errors to user
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		/**
		 * Usando req.body.nombre 
		 * porque req.param('nombre') es deprecated
		 */
		res.render('user/edit', {
			titulo: 'Editar Usuario',
			id: req.params.id,
			nombre: req.body.nombre,
			edad: req.body.edad,
			email: req.body.email
		})
	}
})

// DELETE USER
app.delete('/delete/(:id)', function (req, res, next) {
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').remove({ "_id": o_id }, function (err, result) {
		if (err) {
			req.flash('error', err)
			// redirecciona a la pagina de users
			res.redirect('/users')
		} else {
			req.flash('success', `Se elimino el usuario con el id: ${req.params.id}`)
			// redirecciona a la pagina de users
			res.redirect('/users')
		}
	})
})

module.exports = app