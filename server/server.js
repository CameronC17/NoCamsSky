var util 	= require('util');
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');

//Class imports
var GameEngine = require('./game/engine').GameEngine;
var DBController = require('./dbcontroller').DBController;
//var Player = require('./game/player').Player;

//Server variables
var myPort = 8000;
var pause = false;
var emitFreq = 50;
var connected = [];

//Start the server
server.listen(process.env.PORT || myPort);
console.log('\n\n----------------------\nServer started.\nListening on PORT: ' + myPort);
//Creating new objects of the classes
var dbController = new DBController(mongoose);
console.log('Starting game engine...');
var gameEngine = new GameEngine(dbController);
//dbController.newUser();
//connect to the db
dbController.connect('mongodb://localhost/nocamssky');
console.log('Database connection: Successful.');
//get the planets from the database
//dbController.getPlanets(gameEngine.setPlanets);

console.log('Game engine started.' + "\n----------------------\n\n");
dataEmitter();

function dataEmitter() {
  for (var i = 0; i < connected.length; i++) {
    var client = connected[i];
    if (client.username != null) {
      //sends the players specific data
      var playerData = gameEngine.getPlayer(client.username);
      if (playerData.landPosition == null) {
        //sends the other players data
        var otherPlayers = gameEngine.getOtherPlayers(client.username);
        //gets information on planets
        var planets = gameEngine.getNearbyPlanets(client.username);
        io.to(client.socket).emit('serverupdate', {
          data: playerData,
          playerCount : gameEngine.players.length,
          otherPlayerData : otherPlayers,
          planetData : planets
        });
      } else {
        var terrainData = gameEngine.getTerrainData(client.username);
        var terrainPlayerData = gameEngine.getPlayerTerrainData(client.username);
        var shipData = gameEngine.getShipData(client.username);
        io.to(client.socket).emit('landserveremit', {
          data: playerData,
          playerCount : gameEngine.players.length,
          terrainData : terrainData,
          terrainPlayerData : terrainPlayerData,
          shipData : shipData
        });
      }
    }
  }
  if (!pause) {
		setTimeout(function () {
			//Recursively loop
	        dataEmitter();
	    }, emitFreq);
  }
}

//////SOCKET FUNCTIONS
//Checks to see if a new connection has been made
io.on('connection', onConnect);

function onConnect(socket) {
	util.log(' + New connection. Reference: ' + socket.id);
	connected.push({"socket" : socket.id, "username" : null});
	console.log('There are currently ' + connected.length + ' users online.\n\n');

	//Functions here can only be ran once user is connected
	socket.on('disconnect', onDisconnect);
  socket.on('newUser', newUser);
  socket.on('login', login);
  socket.on('keypress', keypress);
  socket.on('landAttempt', landAttempt);
  socket.on('takeOff', takeOff);
  socket.on('shipupgrade', shipUpgrade);
};

function onDisconnect() {
	util.log(" - User diconnected. Reference: " + this.id);
  var userPosition = connected.map(function(e) { return e.socket; }).indexOf(this.id);
  if (userPosition > -1) {
    if (connected[userPosition].username != null) {
      dbController.savePlayerData(gameEngine.getPlayer(connected[userPosition].username));
      gameEngine.removePlayer(connected[userPosition].username);
    }
    connected.splice(userPosition, 1);
  } else {
    console.log("Failed to find player disconnect\n\n");
  }
	console.log('There are ' + connected.length + ' users connected.\n\n');
};

function newUser(data) {
  dbController.newUser(data);
}

function login(data) {
  dbController.login(data, loginCallback, this.id);
}

function loginCallback(data, id) {
  if (data.username != undefined) {
    //checks if already logged in
    if (!checkAlreadyLoggedIn(data.username)) {
      var userPosition = connected.map(function(e) { return e.socket; }).indexOf(id);
      if (userPosition > -1) {
        connected[userPosition].username = data.username;
        gameEngine.addPlayer(data);
        util.log("User logged in: " + data.username + "\n\n");
      }
    } else {
      data = false;
    }
  }
  io.to(id).emit('loginconfirm', {data: data});
}

function checkAlreadyLoggedIn(username) {
  for (var i = 0; i < connected.length; i++) {
    if (username == connected[i].username)
      return true;
  }
  return false;
}

function landAttempt(data) {
  var userPosition = connected.map(function(e) { return e.socket; }).indexOf(this.id);
  if (userPosition > -1) {
    if (connected[userPosition].username != null) {
      gameEngine.landAttempt(connected[userPosition].username, data);
    }
  }
}

function takeOff() {
  var userPosition = connected.map(function(e) { return e.socket; }).indexOf(this.id);
  if (userPosition > -1) {
    if (connected[userPosition].username != null) {
      gameEngine.takeOff(connected[userPosition].username);
    }
  }
}

function keypress(data) {
  var userPosition = connected.map(function(e) { return e.socket; }).indexOf(this.id);
  if (userPosition > -1) {
    var player = gameEngine.getPlayer(connected[userPosition].username);
    if (player.landPosition == null) {
      player.input(data);
    } else {
      player.inputTerrainMove(data);
    }
  } else {
    console.log("Failed to find player\n\n");
  }
}

function shipUpgrade(data) {
  var userPosition = connected.map(function(e) { return e.socket; }).indexOf(this.id);
  //console.log("Player " + connected[userPosition].username + " wants to upgrade part " + data);
  gameEngine.upgradeShip(connected[userPosition].username, data);
}
