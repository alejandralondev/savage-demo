// this is the root of us building any application from here on out
// we are locally hosting this on our server but requesting from leon's db
// you should have a new db for each project, not a new cluster but a new db because you want your collections to be similar
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient // mongo db is an entity that can hold a bunch of objects, documents

var db, collection;

const url = "mongodb+srv://demo:demo@cluster0-q2ojb.mongodb.net/test?retryWrites=true";
const dbName = "demo";

app.listen(9000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        // setting variable of db you connected to (demo)
        db = client.db(dbName); 
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// whole db is mongo database
// break db down into collections
// collections broken up into individual documents 
// a collection is only created on your mongo database
// no index.html needed because index.ejs
app.get('/', (req, res) => {
  db.collection('messages').find().sort({thumbUp: -1}).toArray((err, result) => { // Request that goes to node environment(server), pings API endpoint that is set up to hear a get request from root route(localhost:4000). That code is set up to do something very particular. It says go to database, find the messages collection & grab all documents from that collection, turn them into array, and pass that array into your ejs template
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result}) // The ejs template is going to make an li for each document that was in our collection
  // When the ejs is done rendering, the ejs will spit out html
  })
})

app.post('/messages', (req, res) => {
  console.log(req)
  // insertOne, mongo is smart enough to know if there's not a db called messages, it will create it 
  // these inserts are happening after the submit from the form client side! form action /messages just like our POST!
  db.collection('messages').insertOne(
    { 
      name: req.body.name,
      msg: req.body.msg, 
      thumbUp: 0, thumbDown: 0 
    }, (err, result) => 
    {
      if (err) return console.log(err)
      console.log('saved to database')
      // second instuction for post is to redirect (refresh page)
      res.redirect('/') 
    }
  )
})
 
app.put('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate(
    {
      name: req.body.name, 
      msg: req.body.msg 
    }, 
    { 
      $set: { thumbUp: req.body.subtract ? req.body.thumbUp - 1 : req.body.thumbUp + 1 }, 
    
    },  {
      sort: {_id: -1}, // specifies the sort order for the query. sorting the documents based on the _id field in descending order (-1), so the most recently created document will be considered first
      upsert: true
    }, (err, result) => 
    {
      if (err) return res.send(err)
      res.send(result)
    }
  )
})

app.put('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate(
    { 
      name: req.body.name, 
      msg: req.body.msg 
    }, 
    { $inc: { thumbUp: - 1} }, 
    {
      sort: {_id: -1}, 
      upsert: true
    }, (err, result) => 
    {
      if (err) return res.send(err)
      res.send(result)
    }
  )
})
// our delete is set up, listening from client side trash can click
// goes to db, finds where name (req.body.name) and msg match and deletes!
app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
