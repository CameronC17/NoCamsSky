//##############################################//
//					     TerrainGenerator Class  	      //
//                			            	        	//
//			© CAMERON CHALMERS, 2016	  	         	//
//##############################################//

/*
   TYPES OF TERRAIN
   --------------------------------
   1: ground - walkable terrain
   2: ground - walkable terrain
   3: ground - walkable terrain
   4: ground - walkable terrain
   5: ground - walkable terrain
   6: ground - walkable terrain
   w: wall   - unpassable wall
   o: ore    - precious resources
   d: damage - tile that will damage the player
*/

class TerrainGenerator {
  constructor() {

  }

  new(planet) {
    var terrain = {
      "name" : planet.name,
      "size" : planet.size,
      "type" : planet.type,
      "terrain" : []
    }

    terrain.terrain = this.createTerrain(terrain.size, terrain.type);

    return terrain;
  }

  createTerrain(size, type) {
    var maxSize = size * 8;
    var rtnArray = [];
    for (var y = 0; y < maxSize; y++) {
      var row = [];
      for (var x = 0; x < maxSize; x++) {
        //checks if were at the edge of the planet
        if (x == 0 || y == 0 || x == maxSize - 1 || y == maxSize - 1) {
          row.push("w");
        } else {
          row.push(this.generateRandomTile());
        }
      }
      rtnArray.push(row);
    }
    return rtnArray;
  }

  generateRandomTile() {
    var tileType = Math.floor(Math.random() * 200) + 0;
    if (tileType < 180) {
      return (Math.floor(Math.random() * 6) + 1).toString();
    } else if (tileType < 198) {
      return "d";
    } else if (tileType < 200) {
      return "o";
    } else {
      return "d";
    }
  }

}

exports.TerrainGenerator = TerrainGenerator;