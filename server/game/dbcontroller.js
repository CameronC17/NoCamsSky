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
    //console.log("HELLLLLLLLLLLLLO: " + data);
    this.User.create({"username" : data.username, "password" : data.password}, function(err, post){
      if(err) {
        console.log("Unable to create user")
      } else {
        console.log("New user created: " + data.username);
      }
    });
  }


}



exports.DBController = DBController;
