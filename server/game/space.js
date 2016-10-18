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

  checkTerrainMove(player, data, terrain) {
    if (data) {
    var pos = player.landPosition;
    var terrID = -1;
    for (var i = 0; i < this.terrain.length; i++) {
      if (this.terrain[i] != null) {
        if (this.terrain[i].name == terrain)
          terrID = i;
      }
    }
    var oldPosX = pos[0];
    var oldPosY = pos[1];
    var newPos = pos;
    if (terrID > -1) {
      if (data.up)
        newPos[1]--;
      if (data.down)
        newPos[1]++;
      if (data.left)
        newPos[0]--;
      if (data.right)
        newPos[0]++;
      //check for collision or whatever
      var terrain = this.terrain[terrID].terrain;
      // || terrain[newPos[1]][newPos[0]] == "d"
      if (newPos[1] > 0 && newPos[1] < (this.terrain[terrID].size * 8)) {
        if (newPos[0] > 0 && newPos[0] < (this.terrain[terrID].size * 8)) {
          // if (terrain[newPos[1]][newPos[0] == "w") {
          //   return [oldPosX, oldPosY];
          // } else if(terrain[newPos[1]][newPos[0]] == "d") {
          //   player.health -= 5;
          //   return [oldPosX, oldPosY];
          // } else {
          //   return newPos;
          // }
          switch (terrain[newPos[1]][newPos[0]]) {
            case "w":
              return [oldPosX, oldPosY];
              break;
            case "d":
              player.health -= 5;
              return [oldPosX, oldPosY];
              break;
            case "o":
              player.currency += (Math.floor(Math.random() * 250) + 40);
              terrain[newPos[1]][newPos[0]] = (Math.floor(Math.random() * 6) + 1).toString();
              return newPos;
              break;
            default:
              return newPos;
              break;
          }
        } else {
          return [oldPosX, newPos[1]];
        }
      } else {
        return [newPos[0], oldPosY];
      }

    }
  }
  }

  takeOff(player) {
    this.removePlayer(player.location);

    player.location = "space";
    player.landPosition = null;
  }

  removePlayer(name,planet) {
    var planetID = this.planets.map(function(e) { return e.name; }).indexOf(planet);
    if (planetID > -1) {
      var playerIndex = -1;
      for (var i = 0; i < this.terrain[planetID].ships.length; i++) {
        if (this.terrain[planetID].ships[i][0] == name)
          playerIndex = i;
      }
      this.terrain[planetID].ships.splice(playerIndex, 1);
    }
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
          this.terrain[planetID].ships.push([player.username, [player.landPosition[0]-1, player.landPosition[1]]]);
          player.location = planet.name;
        } else {
          this.terrain[planetID] = this.terrainGenerator.new(planet);
          player.landPosition = this.landPlayerPosition(planetID);
          this.terrain[planetID].ships.push([player.username, [player.landPosition[0]-1, player.landPosition[1]]]);
          player.location = planet.name;
        }
      }
    }
  }

  getShips(player) {
    var rtnArray = [];
    var planetID = this.planets.map(function(e) { return e.name; }).indexOf(player.location);
    return this.terrain[planetID].ships;
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
              if (x < 0 || y < 0 || x > (terrain.size * 8) - 1 || y > (terrain.size * 8) - 1)
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

  getPlayerTerrainData(pos, otherPlayers) {
    var rtnArray = [];
    for (var i = 0; i < otherPlayers.length; i++) {
      if (otherPlayers[i].position[0] > pos[0] - 12 && otherPlayers[i].position[0] < pos[0] + 12 && otherPlayers[i].position[1] > pos[1] - 12 && otherPlayers[i].position[1] < pos[1] + 12) {
        var newPos = [];
        newPos[0] = pos[0] - otherPlayers[i].position[0];
        newPos[1] = pos[1] - otherPlayers[i].position[1];
        //console.log(newPos);
        var nearbyPlayer = {
          "name" : otherPlayers[i].username,
          "position" : newPos,
          "health" : otherPlayers[i].health,
          "character" : otherPlayers[i].character
        }

        rtnArray.push(nearbyPlayer);
      }
    }
    return rtnArray;
  }

  landPlayerPosition(planetID) {
    var planetSize = this.planets[planetID].size * 8;
    var suitablePosition = [null, null];

    while (suitablePosition[0] == null && suitablePosition[1] == null) {
      var xPos = (Math.floor(Math.random() * planetSize) + 1);
      var yPos = (Math.floor(Math.random() * planetSize) + 1);
      if (xPos < 0 || yPos < 0 || xPos > (planetSize) - 1 || yPos > (planetSize * 8) - 1) {
        console.log("tried to put a player out of bounds");
      } else {
        if (this.terrain[planetID].terrain[yPos][xPos] != "d" && this.terrain[planetID].terrain[yPos][xPos - 1] != "d") {
          suitablePosition[0] = xPos;
          suitablePosition[1] = yPos;
        }
      }
    }
    return suitablePosition;
  }

  canLand(playerPos, planet) {
    if (playerPos[0] > planet.position[0] - planet.size && playerPos[0] < planet.position[0] + planet.size && playerPos[1] > planet.position[1] - (planet.size*2) && playerPos[1] < planet.position[1] + planet.size) {
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
