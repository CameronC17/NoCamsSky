//##############################################//
//					Game Engine Class          		      //
//                			            	        	//
//			© CAMERON CHALMERS, 2016	  	         	//
//##############################################//

//includes
var Space = require('./space').Space;
var Player = require('./player').Player;

class GameEngine {
  constructor(dbConnection) {
    this.space = new Space();
    this.dbConnection = dbConnection;
    this.players = [];
    this.pause = false;
    this.gameTick= 50;
    this.setPlanets();
    this.run();
  }

  addPlayer(player) {
    var plyr = new Player(player);
    this.players.push(plyr);
  }

  setPlanets(data) {
    var obj = this.space.getThis();
    this.dbConnection.getPlanets(this.space.setPlanets, obj);
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

  getTerrainData(name) {
    var player = this.getPlayer(name);
    return this.space.getTerrainData(player.landPosition, player.location);
  }

  getPlayerTerrainData(name) {
    var player = this.getPlayer(name);
    var otherPlayers = [];
    //get other players on same terrain
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].location == player.location && this.players[i].username != player.username) {
        otherPlayers.push({"name" : this.players[i].username, "position" : this.players[i].landPosition, "health" : this.players[i].health, "character" : this.players[i].character });
      }
    }
    return this.space.getPlayerTerrainData(player.landPosition, otherPlayers);
  }

  getNearbyPlanets(name) {
    var player = this.getPlayer(name);
    var rtnArray = [];
    var planets = this.space.getPlanets();
    for (var i = 0; i < planets.length; i++) {
      var planet = planets[i];
      if (player.isClose(planet.position)) {
        rtnArray.push(planet)
      }
    }
    //get players on planet here
    return rtnArray;
  }

  landAttempt(name, planet) {
    var player = this.getPlayer(name);
    this.space.landAttempt(player, planet);
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
      if (this.players[i].landPosition == null) {
        if (this.players[i].readyToMove) {
          var nextMove = this.space.checkMove(this.players[i].position, 1, this.players[i].direction);
          this.players[i].position = nextMove;
          this.players[i].resetMovement();
        }
      } else if (this.players[i].readyToMove) {
        var currTime = new Date().getTime();
        // this number if how many milliseconds between moves                         \/
        if (this.players[i].lastMove == null || currTime > this.players[i].lastMove + 100) {
          var nextMove = this.space.checkTerrainMove(this.players[i], this.players[i].terrainMovement, this.players[i].location);
          this.players[i].landPosition = nextMove;
          this.players[i].lastMove = new Date().getTime();
          this.players[i].resetMovement();
        }
      }
    }
  }
}



exports.GameEngine = GameEngine;
