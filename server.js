const express = require ('express');
const MongoClient = require ('mongodb').MongoClient;
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { Chats } = require('./models/Chats');
const chats = new Chats();

const port = 8000;


// Mongo database connection
// mongoose.connect('mongodb://root:root123@ds129031.mlab.com:29031/supportchatdb', { useNewUrlParser: true }, (err, db) => {
//   if (err) {
//     return console.log(err);
//   }
//
//   // inserting a record into collection
//   db.collection('users').insertOne(
//     {
//       NAME: 'Test',
//       EMAIL: 'test@gmail.com',
//       PASSWORD: 'test123'
//     },
//     function (err, res) {
//       if (err) {
//         db.close();
//         return console.log(err);
//       }
//       // Success
//       db.close();
//     }
//   )
// });

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
    // console.log(chats.getAllChats());
    let allChats =  chats.getAllChats();
    allChats[0].MESSAGES.push(msg);
    console.log(allChats);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log("listening on *:" + port);
});
