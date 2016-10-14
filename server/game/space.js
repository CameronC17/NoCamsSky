//##############################################//
//					     Space Class          		      //
//                			            	        	//
//			© CAMERON CHALMERS, 2016	  	         	//
//##############################################//

class Space {
  constructor() {
    this.size = 5000;
  }

  checkMove(position, speed, direction) {
    var attemptPosition = this.moveShip(position, speed, direction);
    return attemptPosition;
  }

  moveShip(position, speed, direction) {
    var newPos = position;
    if (direction < 15) {
      newPos[1]-= speed * 4;
    } else if (direction < 45) {
      newPos[0]+= speed * 1;
      newPos[1]-= speed * 3;
    } else if (direction < 75) {
      newPos[0]+= speed * 3;
      newPos[1]-= speed * 1;
    } else if (direction < 105) {
      newPos[0]+= speed * 4;
    } else if (direction < 135) {
      newPos[0]+= speed * 3;
      newPos[1]+= speed * 1;
    } else if (direction < 165) {
      newPos[0]+= speed * 1;
      newPos[1]+= speed * 3;
    } else if (direction < 195) {
      newPos[1]+= speed * 4;
    } else if (direction < 225) {
      newPos[0]-= speed * 1;
      newPos[1]+= speed * 3;
    } else if (direction < 255) {
      newPos[0]-= speed * 3;
      newPos[1]+= speed * 1;
    } else if (direction < 285) {
      newPos[0]-= speed * 4;
    } else if (direction < 315) {
      newPos[0]-= speed * 3;
      newPos[1]-= speed * 1;
    } else if (direction < 345) {
      newPos[0]-= speed * 1;
      newPos[1]-= speed * 3;
    } else if (direction <= 360) {
      newPos[1]-= speed * 4;
    }
    return newPos;
  }



}



exports.Space = Space;
