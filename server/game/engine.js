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
    var location = this.getPlayer(name).location;
    this.space.removePlayer(name, location);
    this.players.splice(this.players.map(function(e) { return e.username; }).indexOf(name), 1);
  }

  getOtherPlayers(name) {
    var player = this.getPlayer(name);
    var rtnArray = [];
    for (var i = 0; i < this.players.length; i++) {
      var other = this.players[i];
      if (other.username != player.username) {
        if (other.isClose(player.position)) {
          rtnArray.push({"username" : other.username, "position" : other.position, "direction" : other.direction, "ship" : other.ship})
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

  takeOff(name) {
    var player = this.getPlayer(name);
    this.space.takeOff(player);
  }

  getShipData(name) {
    var player = this.getPlayer(name);
    return this.space.getShips(player);
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

  upgradeShip(name, shipPart) {
    var player = this.getPlayer(name);
    //console.log("It will cost " + this.getUpgradeCost(player.ship[shipPart]) + " Edds");
    var cost = this.getUpgradeCost(player.ship[shipPart]);
    if (player.currency >= cost) {
      player.currency -= cost;
      if (shipPart < 4) {
        player.ship[shipPart]++;
      } else if (shipPart == 4){
        if (player.health + 50 > 100)
          player.health = 100;
        else
          player.health += 50;
      }
    }
  }

  getUpgradeCost(lvl) {
    switch (lvl) {
      case 1:
        return 600;
        break;
      case 2:
        return 1200;
        break;
      case 3:
        return 2000;
        break;
      case 4:
        return 5000;
        break;
      default:
        return 9999999999999999999999;
        break;
    }
  }

  checkMovement() {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].landPosition == null) {
        if (this.players[i].readyToMove) {
          var nextMove = this.space.checkMove(this.players[i].position, this.players[i].ship[0], this.players[i].direction);
          this.players[i].position = nextMove;
          this.players[i].resetMovement();
        }
      } else if (this.players[i].readyToMove) {
          var nextMove = this.space.checkTerrainMove(this.players[i], this.players[i].terrainMovement, this.players[i].location);
          this.players[i].landPosition = nextMove;
          this.players[i].resetMovement();
      }
    }
  }
}



exports.GameEngine = GameEngine;
