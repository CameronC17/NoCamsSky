//##############################################//
//					Game Engine Class          		      //
//                			            	        	//
//			© CAMERON CHALMERS, 2016	  	         	//
//##############################################//

//includes
var Space = require('./space').Space;
var Player = require('./player').Player;

class GameEngine {
  constructor() {
    this.space = new Space();
    this.players = [];
    this.pause = false;
    this.gameTick= 50;
    this.run();
  }

  addPlayer(player) {
    var plyr = new Player(player);
    this.players.push(plyr);
  }

  run() {
    


    var obj = this;
    if (!this.pause) {
  		setTimeout(function () {
  			//Recursively loop
  	        obj.run();
  	    }, obj.gameTick);
    }
  }


}



exports.GameEngine = GameEngine;
