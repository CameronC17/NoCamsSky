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
    player.location = "space";
    player.landPosition = null;
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
      if (this.players[i].readyToMove) {
        var nextMove = this.space.checkMove(this.players[i].position, 1, this.players[i].direction);
        this.players[i].position = nextMove;
        this.players[i].resetMovement();
      }
    }
  }





}



exports.GameEngine = GameEngine;
