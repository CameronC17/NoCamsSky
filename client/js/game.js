var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    || window.oRequestAnimationFrame      || window.msRequestAnimationFrame     || null ;

//Creating instances of canvas and the canvas' 2d drawing
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var loaded = false;
var gameTick = 50;

var test = false;

//GAME DATA

var posData = [];

var images = [
  {
    "name" : "randomcat",
    "image" : "http://i.imgur.com/LBY8Pvx.jpg",
    "width" : 171,
    "height" : 86,
    "mWidth" : 2052,
    "mHeight" : 946,
    "timing" : 60,
    "multiline" : true
  }
];

var spriter = new Spriter();
spriter.loadSprites(images);

function mainLoop() {
  clearScreen();
  if (!loaded) {
    drawBackground();
    checkLoad();
  } else {
    drawSprites();
  }
}

function clearScreen() {
  ctx.fillStyle="#fff";
  ctx.fillRect(0, 0, c.width, c.height);
}

function drawBackground() {
  ctx.fillStyle="#23f390";
  ctx.fillRect(0, 0, c.width, c.height);
}

function checkLoad() {
  ctx.fillStyle="#ff0000";
  if (spriter.checkLoaded()) {
    loaded = true;
  }
  //var loadText = "LOADING";
  ctx.font="70px Arial";
  ctx.fillText("LOADING", 460, 400);
  //ctx.fillText(loadText, c.width - (ctx.measureText(loadText).width / 2), c.height - (ctx.measureText(loadText).height / 2));
}

function drawSprites() {
  for (var i = 0; i < posData.length; i++) {
    var sprite = spriter.getSprite(posData[i][0]);
    if (sprite != null) {
      ctx.drawImage(sprite.image,sprite.x,sprite.y,sprite.width,sprite.height,posData[i][1],posData[i][2],sprite.width,sprite.height);
    }
  }
}



//This loops the animation frames for animation!!!!
var recursiveAnim = function() {
          mainLoop();
          animFrame(recursiveAnim);
    };
animFrame(recursiveAnim);

//game engine #####################################
function game() {

	setTimeout(function () {
		game();
  }, gameTick);
}
game();
