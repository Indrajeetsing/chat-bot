class ChatRooms {

    constructor() {
        this.chatRooms = [];
    }

    getChatRooms() { return this.chatRooms; }

    getChatRoom(roomName) { return this.chatRooms.find(room => room.name === roomName); }

    getRoomById(id) { return this.chatRooms.find(room => room.id === id); }

    addChatRoom(roomName, id) {
        if(!this.chatRooms.find(room => room.name === roomName)) {
            this.chatRooms.push({
                name: roomName,
                id: id,
                users: [],
                messages: []
            })
        }
    }

    removeChatRoom(roomName) {
        this.chatRooms = this.chatRooms.filter((room) => {
                return room.name !== roomName;
        })
    }

    addUser(userName, roomName) {
        const room = this.chatRooms.find(room => room.name === roomName);
        room.users.push(userName);
    }

    removeUser(userName, roomName) {
        const room = this.getChatRoom(roomName);

        if(room) {
            room.users = room.users.filter(user => user !== userName);
            if(!room.users.length){
                this.removeChatRoom(roomName);
            }
        }
    }

    addMessage(message,roomName){
        const room = this.getChatRoom(roomName);
        if(room){
            room.messages.push(message);
        }
    }
}

module.exports = { ChatRooms };
