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
    this.movement = {
      "up": false,
      "down": false,
      "left": false,
      "right": false
    }
    this.lastInput = null;
    this.readyToMove = false;
    //console.log(this);
  }

  input(data) {
    //console.log(data.right || data.left);
    if (data.left || data.right) {
      if (data.left) {
        this.direction -= 2;
        if (this.direction < 0) {
          this.direction = 360 + this.direction;
        }
      } else if (data.right) {
        this.direction += 2;
        if (this.direction > 360) {
          this.direction = this.direction - 360;
        }
      }
      //console.log(this.direction);
    }
    if (data.up) {
      this.movement = data;
      this.readyToMove = true;
      this.lastInput = new Date().getTime();
    }
  }

  isClose(pos) {
    if (this.position[0] > pos[0] - 700 && this.position[0] < pos[0] + 700 && this.position[1] > pos[1] - 500 && this.position[1] < pos[1] + 500)
      return true;
    return false;
  }

  resetMovement(){
    this.movement = {
      "up": false,
      "down": false,
      "left": false,
      "right": false
    }
    this.lastInput = null;
    this.readyToMove = false;

  }

}



exports.Player = Player;
