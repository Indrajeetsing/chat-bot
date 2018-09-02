const express = require ('express');
const MongoClient = require ('mongodb').MongoClient;
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { Chats } = require('./models/Chats');
const Users = require('./models/Users');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const chats = new Chats();
const config = require('./config');
// const bodyParser = require('body-parser')

const port = 8000;

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.use(cors());

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
    return res.send({success: false,
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
		// return next(err);
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
		newUser.is_admin = is_admin;
    newUser.save((err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error.'
        });
				// return next(err);
      }

      // create a token
    const token = jwt.sign({ id: users._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    return res.status(200).send({success: true, auth: true, token: token });

        // return res.send({
        //   success: true,
        //   message: 'Signed Up'
        // });

  })

})
})


// varify
app.get('/verify', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    Users.findById(decoded.id, { password: 0 }, // projection : We don't want user to be returned with users data let's omit it using projection
      function (err, user) {
  if (err) return res.status(500).send("There was a problem finding the user.");
  if (!user) return res.status(404).send("No user found.");

  res.status(200).send(user);
});
  });
});




// sign in
app.post('/signin', (req, res, next) => {
  const {
    name,
    password,
		is_admin
  } = req.body;

  if ( !name || !password){
    return res.send({success: false,
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

    var token = jwt.sign({ id: users._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
     });
     res.status(200).send({ success: true, auth: true, token: token, is_admin: user.is_admin });
// });
});});


//logout - Just clear the authtoken from localstorage. Don't need to make this call even.
app.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

// get all users
app.get('/users', function (req, res) {

    // BAD! Creates a new connection pool for every request
    mongoose.connect('mongodb://root:root123@ds129031.mlab.com:29031/supportchatdb', { useNewUrlParser: true }, (err, db) => {
      if (err) throw err;

    const coll = db.collection('users');

    coll.find({}).toArray(function (err, result) {
        if (err) {
            res.send(err);
        } else {

            res.send(JSON.stringify(result));
        }
    })

    });
  });

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('message: ' + msg);
  });

  socket.on('disconnect', function(){
		// localStorage.clear();
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log("listening on *:" + port);
});
