const express = require ('express');
const MongoClient = require ('mongodb').MongoClient;
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { Chats } = require('./models/Chats');
const Users = require('./models/Users');
const chats = new Chats();
const config = require('./config');
// const bodyParser = require('body-parser')

const port = 8000;

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

mongoose.connect(config.db, () => {
	console.log('Successfully connected to mongodb database...');
});

// signup
app.post('/signup', (req, res, next) => {
  const {
    name,
    password,
    is_admin
  } = req.body;

  if ( !name || !password){
    res.send({success: false,
              message: "ERROR: Name OR Password cannot be blank"})
  }


Users.find({
  name: name
}, (err, userExist) => {
  if (err){
      return res.send({
      success: false,
      message: 'Error: Server error.'
    });
  } else if (userExist.length > 0) {
      return res.send({
      success: false,
      message: 'Error: Account already exist.'
    });
  }

    // save the user
    const newUser = new Users();
    newUser.name = name;
    newUser.password = newUser.generateHash(password);
    newUser.save((err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error.'
        });
      }
        return res.send({
          success: true,
          message: 'Signed Up'
        });

  })

})
})

// sign in
app.post('/signin', (req, res, next) => {
  const {
    name,
    password
  } = req.body;

  if ( !name || !password){
    res.send({success: false,
              message: "ERROR: Name OR Password cannot be blank"})
  }

Users.find({
  name: name
}, (err, users) => {
  if (err){
      return res.send({
      success: false,
      message: 'Error: Server error.'
    });
  } else if (users.length != 1) {
      return res.send({
      success: false,
      message: 'Error: Invalid!!'
    });
  }

  const user =users[0];
  if (!user.validPassword(password, user.password)) {
    return res.send({
      success: false,
      message: 'Error: Invalid!!'
    });
  }

  // Correct User
  const newUser = new Users();
  newUser.save((err, users) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error.'
      });
    }
      return res.send({
        success: true,
        message: 'Valid Sign in'
      });

});
});});



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

// TODO: Check the USER_ID and send that object
// Mongo database connection
mongoose.connect('mongodb://root:root123@ds129031.mlab.com:29031/supportchatdb', { useNewUrlParser: true }, (err, db) => {
  if (err) {
    return console.log(err);
  }

    // inserting a record into collection
    db.collection('users').insertOne(
      allChats[0],
      function (err, res) {
        if (err) {
          db.close();
          return console.log(err);
        }
        // Success
        db.close();
      }
    )});
    console.log(allChats);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log("listening on *:" + port);
});
