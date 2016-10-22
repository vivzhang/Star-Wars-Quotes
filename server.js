'use strict';

const express = require('express');
// bodyParser is middleware that handles reading data from the <form> element(gets input value with Express) with the use method
// middleware is basically plugins that change the request or response object before they get handled by our application. Make sure you place body-parser before your CRUD handlers!
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;

// express' .use method allows us to use any middlewares(inside app.use())
// The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body of the request
// *** ALWAYS PUT bodyParser BEFORE THE CRUD HANDLERS ***
app.use(bodyParser.urlencoded({extended: true}));

// *************** CRUD handlers below ***************

// created server with express and listening to port 3000
// app.listen(8000, function() {
//   console.log('listening on 8000');
// })

// R - READ
// when user send a request to localhost:3000/, '/' is the path
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err);
    // render index.ejs
    // rendering generates the HMTL with our quotes, eg. res.render(views, locals)
    // views is the name we're rendering and must be in a views folder
    // locals is an object that passes data into the views
    // so index.ejs can refer to locals for 'quotes'
    res.render('index.ejs', {quotes: result});
  })

  // __dirname is the path to the current working directory, change the app so we serve an index.html page back to the browser instead
  // res.sendFile(__dirname + '/index.html');

  // we can get the quotes from MongoLab with find method in collection method
  // find() returns a cursor(a mongo object), which contains all the quotes and
  // other properties and methods
  // var cursor = db.collection('quotes').find();
  // toArray method returns an array of all the documents in cursor(quotes here)
  // cursor.toArray(function(err, result) { console.log(result) })
  // => [ { _id: 5807efd0959ca8a2e3fa823b,
  //   name: 'Jennifer',
  //   quote: 'Hello hello this is our first database!' },
  // { _id: 5807f03fc431272014f1b517,
  //   name: 'Viv',
  //   quote: 'Believe in yourself!' },
  // { _id: 5807f2a83e9c7a2026929d36,
  //   name: 'Elmer',
  //   quote: 'You have to try harder!' },
  // { _id: 5807f2c83e9c7a2026929d37,
  //   name: 'Mom',
  //   quote: 'You are not wearing enough!' } ]
})

// C - CREATE (use <form> element to get PULL request triggered)
app.post('/quotes', (req, res) => {
  // req.body contains the body of the request(have to use bodyParser first, above)
  // console.log(req.body); // { name: 'Yoda', quote: 'hey' }
  // create a quotes collection in database and save req.body in it simultaneously
  // db.collection('quotes') is the {...} of the new quote just been submitted
  // 1st para in save() is the documentation we want to save, 2nd is optional
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database');
    // redirect the user to '/', so the browser will reload
    res.redirect('/');
  })
})

// ***** connect server with mongo database *****

var mongolink = 'mongodb://vivzhang:starwar@ds019916.mlab.com:19916/star-war-quotes';

var db;
MongoClient.connect(mongolink, (err, database) => {
  if (err) return console.log(err);
  db = database;
  // always start the sever when the database is connected, put .listen in .connect
  app.listen(8000, () => {
    console.log('listening on 8000');
  })
})

// added ejs as our template engine(break HTML code into smaller files and lets you use data)
app.set('view engine', 'ejs');

// U - UPDATE

// whenver we use .use(), the function we passed in is a middleware
// .static makes the public folder accessible to the public
app.use(express.static('public'));

// make server to read JSON file by using bodyParser.json() since server can't read JSON file
app.use(bodyParser.json());

// req here is the request from fetch
app.put('/quotes', (req, res) => {
  // handle put request
  // we will look for the last quote by Master Yoda and change it to a quote by Darth Vadar in MongoDB
  // .findOneAndUpdate(4 paras) in mongo changes one item from the database
  db.collection('quotes').findOneAndUpdate(
    // query, allows us to filter the collection through key-value pairs given to it
    {
      name: 'Yoda'
    },
    // update, tells mongo what to do with the update request
    {
      // $set is one of mongo's update operators ($inc, $push etc)
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    },
    // options, optional para allow you to define addition request
    {
      sort: {_id: -1},
      // if there is no quotes by Master Yoda, will insert a new one
      upsert: true
    },
    // callback
    (err, result) => {
      if (err) return res.send(err);
      res.send(result)
    }
  )
})

// D - DELETE (use javascript to get DELETE request triggered)

app.delete('/quotes', (req, res) => {
  // handle delete event here
  db.collection('quotes').findOneAndDelete( // 3 para, query, option, callback
    { name: req.body.name },
    (err, result) => {
      if (err) return res.send(500, err);
      res.send(JSON.stringify('A darth vadar quote got deleted'))
    }
  )
})



