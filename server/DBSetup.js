var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nocamssky');

var PlanetSchema = new mongoose.Schema({
  name : { type: String, required: true },
  size : { type: Number, required: true },
  type : { type: String, required: true },
  position : { type: Array, required: true }
});

var Planet = mongoose.model('Planet', PlanetSchema);

var planetArray = [
  {
    "name" : "Azeroth",
    "size" : 100,
    "type" : "Earth",
    "position" : [1300, 2600]
  },
  {
    "name" : "Mastramus",
    "size" : 80,
    "type" : "Ice",
    "position" : [3400, 4300]
  },
  {
    "name" : "Snezal",
    "size" : 140,
    "type" : "Fire",
    "position" : [2900, 500]
  },
  {
    "name" : "Lamion",
    "size" : 60,
    "type" : "Waste",
    "position" : [2200, 3300]
  }
];

Planet.collection.insert(planetArray, onInsert);

function onInsert(err, docs) {
    if (err) {
        console.log("Unable to add documents to the database.");
    } else {
        console.info('All planets were successfully stored.');
    }
}
