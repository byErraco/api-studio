const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');

const morgan = require('morgan')

const http = require('http')

const cors = require('cors');

//Inicializacion
const app = express();
const server = http.createServer(app);

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Configuracion
app.set("port", process.env.PORT || 3000);

server.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
  console.log('Environment:', process.env.NODE_ENV);
})


//Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));



//Routes
app.use(require('./routes/emails.routes'));







module.exports = app;


