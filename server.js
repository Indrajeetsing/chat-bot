const express = require ('express');
const MongoClient = require ('mongodb').MongoClient;
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Users = require('./models/Users');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const config = require('./config');
const { ChatRooms } = require('./ChatRooms');
const chatrooms = new ChatRooms();
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
    return res.send({success: false, message: "ERROR: Name OR Password cannot be blank"})
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
  	})
	})
})


// varify
app.get('/verify', function(req, res) {
	// console.log(req);
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
		return res.status(200).send({success: true});
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
    return res.send({success: false, message: "ERROR: Name OR Password cannot be blank"})
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
	});
});


io.on('connection', function(socket){
	socket.on('disconnect', function(){
		const room = chatrooms.getRoomById(socket.id);
		if(room){
			chatrooms.removeChatRoom(room.name);
			io.emit('update chat rooms admin',chatrooms.getChatRooms());
		}

	});


	socket.on('chat message', function(data){
		const room = chatrooms.getChatRoom(data.roomName);
		if (room){
			room.messages.push(data.message);
			io.emit('chat message', data);
		}

	});

	// Get available users
	socket.on('get users', function(){
		io.emit('update chat rooms admin',chatrooms.getChatRooms());
	})

	socket.on('create room', function(roomName){
		chatrooms.addChatRoom(roomName, socket.id);
		chatrooms.addUser(roomName, roomName);
		io.emit('update chat rooms', chatrooms.getChatRooms());
	})

	socket.on('get messages', function(roomName){
		const room = chatrooms.getChatRoom(roomName);
		io.emit('update user messages', room.messages);
	});
});


http.listen(port, function(){
  console.log("listening on *:" + port);
});
