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
    this.direction = data.direction;
    this.currency = data.currency;
    this.health = data.health;
    if (data.position[0] != null && data.position[1] != null)
      this.position = data.position;
    else {
      var pos = [null, null];
      pos[0] = Math.floor(Math.random() * 4900) + 100;
      pos[1] = Math.floor(Math.random() * 4900) + 100;
      this.position = pos;
    }
    console.log(this);
  }

}



exports.Player = Player;
