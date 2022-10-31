// use the express library
const express = require('express');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');

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

app.get("/trivia", async (req, res) => {
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }
  const content = await response.json();
  if (content.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${content.response_code}`);
    return;
  }

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  let question_meta = content.results[0];
  question_meta.answers = question_meta.incorrect_answers;
  question_meta.answers.push(question_meta.correct_answer);

  shuffle(question_meta.answers);

  // res.send(JSON.stringify(content, 2));
  res.render('trivia', question_meta);
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");
