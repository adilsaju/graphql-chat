var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRoute = require('./routes/mainRoute');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

//DATABASE SETUP
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useCreateIndex: true } )
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true } )
// const db = mongoose.connection 
// db.on('error',(error)=>console.error(error))
// db.once('open',()=>console.error('connected to database'))


app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use("/api/v1/", mainRoute)

app.use((req, res, next) => {
    res.status(404);
    res.send({
      error: '404 Page: Not found',
    });
  });

module.exports = app;
