require("dotenv").config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require("cors");
var app = express();

const functions = require('firebase-functions');
//My routes
var core = require('./routes/core');
const booksController = require('./controllers/books-controller');
const categoriesController = require('./controllers/categories-controller');


app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
var mysql = require('mysql');

const runtimeOpts = {
    timeoutSeconds: 60,
    memory: '1GB'
  }
app.use('/v1', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://kariac.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
},core);
app.get("/", (req, res) => {
  res.send("hello  dsssdddddd");
});
// var con =  mysql.createConnection('mysql://root:my_secret_password@localhost:6033/u282083066_kariac?debug=true');
var con=mysql.createConnection({
  host: "148.66.138.198",
  user: "u282083066_karia",
  password: "Kariac#123",
  database: "u282083066_kariac",
  // host     : 'host.docker.internal',
  // user     : 'root',
  // password : 'my_secret_password',
  // database : 'u282083066_kariac',
  // server   : 'db',
  // port     : 6033,
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

exports.api = functions.https.onRequest(app);