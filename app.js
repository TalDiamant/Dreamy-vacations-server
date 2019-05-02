var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser')
var cors = require('cors');
var mySocketHelper = require('./utilities/mysockethelper');

//import routers
var usersRouter = require('./routes/users-router');
var vacationsRouter = require('./routes/vacations-router');

var app = express();
app.use(cors())

var server = require('http').createServer(app);
var io = require('socket.io')(server);
mySocketHelper.startSockets(io);
server.listen(8888);

app.use(session({
    secret: 'abaganuv',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false    }
}));

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb' , extended: true}))

app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "content-type");
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.use('/users', usersRouter);
app.use('/vacations', vacationsRouter);


module.exports = app;
