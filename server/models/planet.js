var mongoose = require('mongoose');

var PlanetSchema = new mongoose.Schema({
  name : { type: String, required: true },
  size : { type: Number, required: true },
  type : { type: String, required: true },
  position : { type: Array, required: true }
});

module.exports = mongoose.model('Planet', PlanetSchema);
