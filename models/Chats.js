class Chats {
  constructor(){

      this.allChats = [
        {
          USER_ID: 'user-1',
          MESSAGES: []
        }
      ];

  };

getAllChats() {
  return this.allChats;
};


}
module.exports = { Chats };
