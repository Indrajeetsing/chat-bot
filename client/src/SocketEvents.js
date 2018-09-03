import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:8000');

const socketOn = {
    chatMessage: (callback) => {
        socket.on('chat message', (dataObject) => {
            callback(dataObject);
        });
    },

    updateChatRoomsAdmin: (callback) => {
        socket.on('update chat rooms admin', (dataObject) => {
            callback(dataObject);
        })
    },

    updateChatRooms: (callback) => {
        socket.on('update chat rooms', (dataObject) => {
            callback(dataObject);
        })
    },

    updateUserMessages: (callback) => {
        socket.on('update user messages', (dataObject) => {
            callback(dataObject);
        })
    }
};

const socketEmit = {
    createRoom: (roomName, callback) => {
        socket.emit('create room', roomName, (err) => callback(err));
    },

    chatMessage: (dataObject, callback) => {
        socket.emit('chat message', dataObject, (err) => callback(err));
    },

    getUsers: (callback) => {
        socket.emit('get users', (err) => callback(err));
    },

    getMessages: (roomName,callback) => {
        socket.emit('get messages', roomName, (err) => callback(err));
    }
};

export { socketOn, socketEmit };
