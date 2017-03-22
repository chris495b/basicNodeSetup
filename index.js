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
app = express(),
ObjectId = require('mongodb').ObjectID;

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
app.use(bodyParser.json());



var db;
MongoClient.connect('mongodb://christie:christie0808@ds143539.mlab.com:43539/star-wars-quotes', (err, database) => {
  // ... start the server
  if (err) return console.log(err);
  db = database,collection=db.collection('quotes');
  app.listen(3000, () => {
    app.get('/', (req, res) => {
        collection.find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('index',{ title : 'Quotes',quotes:result });
        })

      //res.sendFile(__dirname + '/index.html')
      // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
      // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
    });
    app.post('/quotes', (req, res) => {
      // ----------
      // find if user name is presnt in db
      // if present update else create new
      // ---------

        collection.find({"name":req.body.name.toLowerCase()}).toArray((err, result) => {
          if (err) return console.log(err)
          if(result.length > 0){
            collection.findOneAndUpdate({"name":req.body.name.toLowerCase()},{ $set: { "quote" :req.body.quote}},(err, result) => {
              if (err) return console.log(err)
              // res.render('index',{ title : 'Quotes',quotes:result });
              console.log("Update sucessful",result);
              res.redirect('/');
            })
          }else{
            req.body.name=req.body.name.toLowerCase();
            collection.save(req.body, (err, result) => {
              if (err) return console.log(err);
              console.log('saved to database');
              res.redirect('/');
            });
          }
        })
        if (err) return console.log(err)
        // res.render('index',{ title : 'Quotes',quotes:result });

      });

    app.delete('/quotes', (req, res) => {
      console.log(req.body._id);
      db.collection('quotes').findOneAndDelete({"_id":ObjectId(req.body._id)},
      (err, result) => {
        if (err) return res.send(500, err)
        res.send({"msg":''+req.body._id+ 'quote got deleted'});
      });
    });
// ----------------------------------------------------------------
// ----------------------------------------------------------------
//Login
//-----------------------------------------------------------------
//-----------------------------------------------------------------
    app.get('/login', (req, res) => {
      res.render('login');
    });
    app.post('/login', (req, res) => {
      console.log(req.body);
      res.redirect('/login');
    });
    console.log('localhost:3000....running');
  });
})
