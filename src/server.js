const express = require('express');
// const Handlebars = require('handlebars');
// const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs-extra');
const methodOverride = require('method-override')
const morgan = require('morgan')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const multer = require('multer');

const socketio = require('socket.io')
const http = require('http')

//Inicializacion
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Configuracion
app.set("port", process.env.PORT || 4000);


app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".ejs");

server.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
  console.log('Environment:', process.env.NODE_ENV);
})


app.enable('trust proxy')


app.use(function(request, response, next) {

  if (process.env.NODE_ENV != 'development' && !request.secure) {
     return response.redirect("https://" + request.headers.host + request.url);
  }

  next();
})



app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session ({
  secret: 'secret',
  resave: true,
  // resave: false,
  saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(multer({
  dest: path.join(__dirname,'./public/uploads/temp')
}).single('userpic'))
app.use(multer({
  dest: path.join(__dirname,'./public/uploads/temp')
}).single('usercv'))



//Variablles Globales
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});



//Routes
app.use(require('./routes/emails.routes'));


//Static Files
app.use(express.static(path.join(__dirname, 'public')));



//ERROR 404
/*app.use('*', function(req, res, next) {
  res.status(404).render('/contacto');
  next();
});*/



module.exports = app;


