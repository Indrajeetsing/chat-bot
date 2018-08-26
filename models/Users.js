const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type    : String,
    default : ''
  },
  password: {
    type    : String,
    default : ''
  },
  is_admin: {
    type    : Boolean,
    default : false
  },
});

module.exports = mongoose.model('Users', UserSchema);
