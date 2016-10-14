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

  getPlayer(name) {
    return this.players[this.players.map(function(e) { return e.username; }).indexOf(name)];
  }

  removePlayer(name) {
    this.players.splice(this.players.map(function(e) { return e.username; }).indexOf(name), 1);
  }

  getOtherPlayers(name) {
    var player = this.getPlayer(name);
    var rtnArray = [];
    for (var i = 0; i < this.players.length; i++) {
      var other = this.players[i];
      if (other.username != player.username) {
        if (other.isClose(player.position)) {
          rtnArray.push({"username" : other.username, "position" : other.position, "direction" : other.direction, "health" : other.health})
        }
      }
    }
    return rtnArray;
  }

  run() {
    this.checkMovement();


    var obj = this;
    if (!this.pause) {
  		setTimeout(function () {
  			//Recursively loop
  	        obj.run();
  	    }, obj.gameTick);
    }
  }

  checkMovement() {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].readyToMove) {
        var nextMove = this.space.checkMove(this.players[i].position, 1, this.players[i].direction);
        this.players[i].position = nextMove;
        this.players[i].resetMovement();
      }
    }
  }


}



exports.GameEngine = GameEngine;
