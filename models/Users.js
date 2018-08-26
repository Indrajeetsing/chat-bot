const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

UserSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = (password, encryptedPass) => {
  return bcrypt.compareSync(password, encryptedPass);
};

module.exports = mongoose.model('Users', UserSchema);
