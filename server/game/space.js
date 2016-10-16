//##############################################//
//					     Space Class          		      //
//                			            	        	//
//			© CAMERON CHALMERS, 2016	  	         	//
//##############################################//

var TerrainGenerator = require('./TerrainGenerator').TerrainGenerator;

class Space {
  constructor() {
    this.size = 5000;
    this.terrainGenerator = new TerrainGenerator();
    this.planets = [];
    this.terrain = [];
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

  landAttempt(player, planet) {
    var planetID = this.planets.map(function(e) { return e.name; }).indexOf(planet);
    if (planetID > -1) {
      var planet = this.planets[planetID];
      if (this.canLand(player.position, planet)) {
        //get the terrian based on planetID
        if (this.terrain[planetID] != null) {
          player.landPosition = this.landPlayerPosition(planetID);
          player.location = planet.name;
        } else {
          this.terrain[planetID] = this.terrainGenerator.new(planet);
          player.landPosition = this.landPlayerPosition(planetID);
          player.location = planet.name;
        }
      }
    }
  }

  getTerrainData(pos, location) {
    var rtnArray = [];
    for (var i = 0; i < this.terrain.length; i++) {
      if (this.terrain[i] != null) {
        var terrain = this.terrain[i];
        if (terrain.name == location) {
          for (var y = pos[1] - 8; y < pos[1] + 8; y++) {
            var row = [];
            for (var x = pos[0] - 10; x < pos[0] + 10; x++) {
              if (x < 0 || y < 0 || x > terrain.size * 8 || y > terrain.size * 8)
                row.push("b")
              else {
                row.push(terrain.terrain[y][x]);
              }
            }
            rtnArray.push(row);
          }
          return [rtnArray, this.terrain.type];
        }
      }
    }
    return null;
  }

  landPlayerPosition(planetID) {
    var planetSize = this.planets[planetID].size * 8;
    var suitablePosition = [null, null];

    while (suitablePosition[0] == null && suitablePosition[1] == null) {
      var xPos = (Math.floor(Math.random() * planetSize) + 1);
      var yPos = (Math.floor(Math.random() * planetSize) + 1);
      if (this.terrain[planetID].terrain[yPos][xPos] != "d") {
        suitablePosition[0] = xPos;
        suitablePosition[1] = yPos;
      }
    }
    return suitablePosition;
  }

  canLand(playerPos, planet) {
    if (playerPos[0] > planet.position[0] - planet.size && playerPos[0] < planet.position[0] + planet.size && playerPos[1] > planet.position[1] - planet.size && playerPos[1] < planet.position[1] + planet.size) {
      return true;
    }
    return false;
  }

  getThis() {
    return this;
  }

  setPlanets(data, obj) {
    obj.planets = data;
    //now set terrain based on number of planets
    for (var i = 0; i < obj.planets.length; i++) {
      obj.terrain.push(null);
    }
  }

  getPlanets() {
    return this.planets;
  }


}



exports.Space = Space;
