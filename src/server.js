// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');

// create a new server application
const app = express();

// middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;


let nextVisitorId = 1;

// The main page of our website
app.get('/', (req, res) => {
  let lastvisitsecond = req.cookies.visited ? (parseInt((Date.now() - req.cookies.visited)/1000)) : -1;
  let visitorId = !req.cookies.visitorId ? nextVisitorId++ : req.cookies.visitorId;

  res.cookie('visitorId', visitorId);
  res.cookie('visited', Date.now().toString());
  res.render('welcome', {
    name: req.query.name || "World",
    date: new Date().toLocaleString(),
    lastvisitsecond,
    visitorId
  });
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");
