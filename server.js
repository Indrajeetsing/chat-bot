const express = require ('express');
const MongoClient = require ('mongodb').MongoClient;
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');

const app = express();

const port = 8000;


// Mongo database connection
mongoose.connect('mongodb://root:root123@ds129031.mlab.com:29031/supportchatdb', { useNewUrlParser: true }, (err, db) => {
  if (err) {
    return console.log(err);
  }

  // inserting a record into collection
  db.collection('users').insertOne(
    {
      NAME: 'Test',
      EMAIL: 'test@gmail.com',
      PASSWORD: 'test123'
    },
    function (err, res) {
      if (err) {
        db.close();
        return console.log(err);
      }
      // Success
      db.close();
    }
  )
});

app.listen(port, () => {
  console.log("Running On " + port);
});
