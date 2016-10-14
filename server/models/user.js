var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username : { type: String, required: true },
  password : { type: String, required: true },
  level : { type: Number, required: true },
  xp : { type: Number, required: true },
  ship : { type: Array, required: true },
  items : { type: Array, required: true },
  character : { type: Number, required: true },
  position : { type: Array, required: true },
  direction : { type: Number, required: true },
  currency : { type: Number, required: true },
  health : { type: Number, required: true }
});

module.exports = mongoose.model('User', UserSchema);
