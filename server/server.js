var util 	= require('util');
var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');

//Class imports
var GameEngine = require('./game/engine').GameEngine;
var DBController = require('./game/dbcontroller').DBController;
//var Player = require('./game/player').Player;



//Server variables
var myPort = 8000;
var connected = [];

//Start the server
server.listen(process.env.PORT || myPort);
console.log('\n\n----------------------\nServer started.\nListening on PORT: ' + myPort);
//Creating new objects of the classes
var gameEngine = new GameEngine();
var dbController = new DBController(mongoose);
//dbController.newUser();
//connect to the db
dbController.connect('mongodb://localhost/nocamssky');
console.log('Database connection: Successful.');
console.log('Starting game engine...' + "\n----------------------");
//game();



//////SOCKET FUNCTIONS
//Checks to see if a new connection has been made
io.on('connection', onConnect);

function onConnect(socket) {
	util.log(' + New connection. Reference: ' + socket.id);
	connected.push(socket.id);
	console.log('There are currently ' + connected.length + ' users online.\n\n');

	//Functions here can only be ran once user is connected
	socket.on('disconnect', onDisconnect);
  socket.on('newUser', newUser);
};

function onDisconnect() {
	util.log(" - User diconnected. Reference: " + this.id);
  var userPosition = connected.indexOf(this.id);
  if (userPosition > -1) {
    connected.splice(userPosition, 1);
  } else {
    console.log("Failed to find player disconnect\n\n");
  }
	console.log('There are ' + connected.length + ' users connected.\n\n');
};

function newUser(data) {
  console.log(data);
}
