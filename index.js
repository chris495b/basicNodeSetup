//global.jQuery = require("jquery")(jsdom.jsdom().defaultView),
//global.window = jsdom.jsdom().defaultView,
//global.document = jsdom.jsdom(),
//global.Tether = require('tether');
const express = require('express'),
bodyParser= require('body-parser'),
MongoClient = require('mongodb').MongoClient,
stylus = require('stylus'),
nib = require('nib'),
path = require('path'),
app = express();

// console.log(bootstrap);

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
// app.use(express.logger('dev'))
app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }))
app.use(express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'node_modules/jquery')));
app.use(express.static(path.join(__dirname, 'node_modules/tether')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
   res.render('index',{ title : 'Home' });
  //res.sendFile(__dirname + '/index.html')
  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
});

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  });

});

var db;
MongoClient.connect('mongodb://christie:christie0808@ds143539.mlab.com:43539/star-wars-quotes', (err, database) => {
  // ... start the server
  if (err) return console.log(err);
  db = database;
  app.listen(3000, () => {
    db.collection('quotes').find().toArray(function(err, results) {
      console.log(results)
      // send HTML file populated with quotes here
    })
    console.log('localhost:3000....running');
  });
})
