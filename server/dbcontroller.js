//##############################################//
//					Database controller Class  		      //
//                			            	        	//
//			© CAMERON CHALMERS, 2016	  	         	//
//##############################################//

/*

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
  health : { type: Number, required: true },
  colour : { type: String, required: true }
});

*/

class DBController {
  constructor(mongodb) {
    this.mongoose = mongodb;
    this.User = require('./models/user');
    this.Planet = require('./models/planet');
  }

  connect(connURL) {
    this.mongoose.connect(connURL);
  }

  newUser(data) {
    this.User.create({
      "username" : data.username,
      "password" : data.password,
      "level" : 1,
      "xp" : 0,
      "ship" : [1,1,1,1,1],
      "items" : [1],
      "character" : 1,
      "position" : [null, null],
      "direction" : 0,
      "currency" : 0,
      "health" : 100,
      "colour" : data.colour
    }, function(err, post){
      if(err) {
        console.log("Unable to create user");
        console.log(err);
      } else {
        console.log("New user created: " + data.username);
      }
    });
  }

  savePlayerData(player) {
    var query = {"username":player.username};
    var newData = {
      "level" : player.level,
      "xp" : player.xp,
      "ship" : player.ship,
      "items" : player.items,
      "character" : player.character,
      "position" : player.position,
      "direction" : player.direction,
      "currency" : player.currency,
      "health" : player.health
    }
    this.User.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
      if (err)
        console.log(err);
      else
        console.log("Succesfully saved player data for user: " + player.username + "\n\n");
    });
  }

  login(data, callback, id) {
    var char = null;
    this.User.findOne({ 'username': data.username }, function (err, user) {
      if (user != undefined) {
        if (data.password === user.password) {
          char = {
            "username" : user.username,
            "level" : user.level,
            "xp" : user.xp,
            "ship" : user.ship,
            "items" : user.items,
            "character" : user.character,
            "position" : user.position,
            "direction" : user.direction,
            "currency" : user.currency,
            "health" : user.health,
            "colour" : user.colour
          }
        }
      }
      if (char == null) {
        callback(false, id);
      }
      else {
        callback(char, id);
      }
    })
  }

  getPlanets(callback, obj) {
    this.Planet.find({}, function(err, planets){
        if(err){
          console.log(err);
        } else{
            //console.log('Retrieved list of planets');
            callback(planets, obj);
        }
    })
  }



}


exports.DBController = DBController;
