//##############################################//
//					     Player Class          		      //
//                			            	        	//
//			© CAMERON CHALMERS, 2016	  	         	//
//##############################################//

class Player {
  constructor(data) {
    this.username = data.username;
    this.level = data.level;
    this.xp = data.xp;
    this.ship = data.ship;
    this.items = data.items;
    this.character = data.character;
    this.position = data.position;
    //console.log(this);
  }

}



exports.Player = Player;
