const mongoose = require('mongoose');

const UserSchema = new mongoose.Schems({
  NAME: {
    TYPE    : String,
    DEFAULT : ''
  },
  EMAIL: {
    TYPE    : String,
    DEFAULT : ''
  },
  PASSWORD: {
    TYPE    : String,
    DEFAULT : ''
  },
  IS_ADMIN: {
    TYPE    : boolean,
    DEFAULT : false
  },
});


module.exports = mongoose.model('user', UserSchema);
