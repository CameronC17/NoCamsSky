//##############################################//
//					Database controller Class  		      //
//                			            	        	//
//			© CAMERON CHALMERS, 2015	  	         	//
//##############################################//

/*

var UserSchema = new mongoose.Schema({
  username : { type: String, required: true },
  password : { type: String, required: true },
  level : { type: Number, required: true },
  xp : { type: Number, required: true },
  ship : { type: Array, required: true },
  items : { type: Array, required: true },
  character : { type: Number, required: true }
});

*/

class DBController {
  constructor(mongodb) {
    this.mongoose = mongodb;
    this.User = require('./models/user');
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
      "position" : [null, null]
    }, function(err, post){
      if(err) {
        console.log("Unable to create user");
        console.log(err);
      } else {
        console.log("New user created: " + data.username);
      }
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
            "position" : user.position
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
}


exports.DBController = DBController;
