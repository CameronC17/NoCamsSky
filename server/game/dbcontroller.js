//##############################################//
//					Database controller Class  		      //
//                			            	        	//
//			© CAMERON CHALMERS, 2015	  	         	//
//##############################################//

class DBController {
  constructor(mongodb) {
    this.mongoose = mongodb;
    this.User = require('../models/user');
  }

  connect(connURL) {
    this.mongoose.connect(connURL);
  }

  newUser(data) {
    this.User.create({"username" : data.username, "password" : data.password}, function(err, post){
      if(err) {
        console.log("Unable to create user")
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
            "username" : user.username
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
