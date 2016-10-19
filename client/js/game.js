var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    || window.oRequestAnimationFrame      || window.msRequestAnimationFrame     || null ;

//Creating instances of canvas and the canvas' 2d drawing
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

//key listener
window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

//mouse listener
window.addEventListener('mousedown', saveMouse, false);

var loaded = false;
var gameTick = 50;

var numStars = 250;

var gameDimensions = [3000, 3000];

var screen = null;

var test = false;

//GAME DATA

var posData = [];

var images = [
  {
    "name" : "thruster",
    "image" : "http://i.imgur.com/xg9cFQ5.png",
    "width" : 50,
    "height" : 178,
    "mWidth" : 200,
    "mHeight" : 178,
    "timing" : 60,
    "multiline" : true
  }
];

var spriter = new Spriter();
spriter.loadSprites(images);

function mainLoop() {
  clearScreen();
  if (!loaded) {
    drawLoading();
    checkLoad();
  } else {
    if (screen.screenPosition != 4)
      screen.draw();
    else {
      game.clearScreen();
      game.draw();
      game.movementListener();
    }
  }
}

function clearScreen() {
  ctx.fillStyle="#fff";
  ctx.fillRect(0, 0, c.width, c.height);
}

function drawLoading() {
  ctx.fillStyle="#23f390";
  ctx.fillRect(0, 0, c.width, c.height);
}

function checkLoad() {
  ctx.fillStyle="#ff0000";
  if (spriter.checkLoaded()) {
    loaded = true;
    screen = new Screen(connection);
  }
  //var loadText = "LOADING";
  ctx.font="70px Arial";
  ctx.fillText("LOADING", 460, 400);
  //ctx.fillText(loadText, c.width - (ctx.measureText(loadText).width / 2), c.height - (ctx.measureText(loadText).height / 2));
}

//This loops the animation frames for animation!!!!
var recursiveAnim = function() {
          mainLoop();
          animFrame(recursiveAnim);
    };
animFrame(recursiveAnim);

// mouse stuff

function saveMouse(e) {
  var pos = getMousePos(e);
  if (pos.x >= 0 && pos.x <= c.width && pos.y >= 0 && pos.y <= c.height) {
    if (screen.screenPosition != 4) {
      screen.checkMouseClick(pos);
    } else {
      game.checkMouseClick(pos);
    }
  }
}

function getMousePos(evt) {
  var rect = c.getBoundingClientRect();
  //Return mouse location related to canvas with JSON format
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

//keyboard stuff

var Key = {
	//http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
  _pressed: {},
  LEFT: 65,
  UP: 87,
  RIGHT: 68,
  DOWN: 83,
  /*FLEFT: 37,
  FUP: 38,
  FRIGHT: 39,
  FDOWN: 40,
  DHEAD: 49,
  DWEAP: 50,
  DLGHT: 51,
  DCHST: 52,
  DBOOT: 53,*/
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  onKeydown: function(event) {
    if (event.keycode == '8')
      event.preventDefault();
    spriter.animate("thruster", true);
    this._pressed[event.keyCode] = true;
  },
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
    //checks to see if any more keys are held down before we cancel the animation
    if (Object.keys(this._pressed).length == 0)
      spriter.animate("thruster", false);
  }
};

// GAME CLASSES!!!!!!!!!!!!!!!

class Screen {
  constructor(connection) {
    //1=home 2=character creation 3=game,space 4=game,planet
    this.screenPosition = 1;
    this.stars = this.createStars(numStars);
    this.resetButton = this.createResetButton();
    this.homeButtons = this.createHomepageButtons();
    this.loginButtons = this.createLoginButtons();
    this.createButtons = this.createCreateButtons();
    this.txtBoxUsername = document.getElementById("username");
    this.txtBoxPassword = document.getElementById("password");
    this.connection = connection;
  }

  draw() {
    switch (this.screenPosition) {
      case 1:
        this.drawHome();
        break;
      case 2:
        this.drawLogin();
        break;
      case 3:
        this.drawCreate();
      default:
        break;
    }
  }

  drawHome() {
    this.drawBackground();
    this.drawStars();
    this.drawTitle();
    this.drawHomeButtons();
  }

  drawBackground() {
    ctx.fillStyle="#000";
    ctx.fillRect(0, 0, c.width, c.height);
  }

  drawHomeButtons() {
    for (var i = 0; i < this.homeButtons.length; i++) {
      this.drawButton(this.homeButtons[i]);
    }
  }

  drawResetButton() {
    this.drawButton(this.resetButton);
  }

  drawButton(btn) {
    var button = btn;
    ctx.fillStyle=button.colour;
    ctx.fillRect(button.x, button.y, button.width, button.height);
    ctx.font="60px Arial";
    ctx.fillStyle="#fff";
    ctx.fillText(button.text, button.x + (button.width/2) - (ctx.measureText(button.text).width / 2), button.y + (button.height/2) + (parseInt(ctx.font) / 3));
  }

  createStars(num) {
    var tempArray = [];
    for (var i = 0; i < num; i++) {
      var star = new Star(null, [c.width, c.height]);
      star.speed = Math.floor(Math.random() * 3) + 1;
      tempArray.push(star);
    }

    return tempArray;
  }

  drawStars() {
    ctx.fillStyle="#fff";
    for (var i = 0; i < this.stars.length; i++) {
      //draw star
      var star = this.stars[i];
      ctx.fillRect(star.x, star.y, star.size, star.size);

      //move star
      star.y += star.speed;

      //now check if the stars are out of bounds
      if (star.y > c.height + 20) {
        star.x = Math.floor(Math.random() * c.width) + 0;
        star.y = Math.floor(Math.random() * 0) - 40;
      }
    }
  }

  drawTitle() {
    ctx.fillStyle="#43e2f1";
    ctx.font="100px Arial";
    switch (this.screenPosition) {
      case 1:
        ctx.fillText("NO CAM'S SKY", (c.width/2) - 360, 200);
        break;
      case 2:
        ctx.fillText("LOGIN", (c.width/2) - 160, 200);
        break;
      case 3:
        ctx.fillText("CREATE AN ACCOUNT", (c.width/2) - 530, 200);
        break;
      default:
        ctx.fillText("HOW DID YOU GET HERE", (c.width/2) - 520, 200);
        break;
    }

  }

  createHomepageButtons() {
    var btns = [];
    btns.push(new Button("#ff6e00", c.width/2 - 250, 320, 500, 100, "LOGIN"));
    btns.push(new Button("#ff6e00", c.width/2 - 250, 500, 500, 100, "CREATE"));
    return btns;
  }

  createLoginButtons() {
    var btns = [];
    btns.push(new Button("#ff6e00", c.width/2 - 250, 520, 500, 100, "LOGIN"));
    return btns;
  }

  createCreateButtons() {
    var btns = [];
    btns.push(new Button("#ff6e00", c.width/2 - 250, 520, 500, 100, "REGISTER"));
    return btns;
  }

  createResetButton() {
    var btn = new Button("#ff26fb", 20, 20, 200, 80, "HOME");
    return btn;
  }

  checkMouseClick(click) {
    //first check if its the home button
    if (click.x >= this.resetButton.x && click.x <= this.resetButton.x + this.resetButton.width && click.y >= this.resetButton.y && click.y <= this.resetButton.y + this.resetButton.height) {
      this.txtBoxUsername.style.display = "none";
      this.txtBoxPassword.style.display = "none";
      this.txtBoxUsername.value = "";
      this.txtBoxPassword.value = "";
      this.screenPosition = 1;
    } else {
    switch (this.screenPosition) {
      case 1:
        this.checkButtons(click, this.homeButtons);
        break;
      case 2:
        this.checkButtons(click, this.loginButtons);
        break;
      case 3:
        this.checkButtons(click, this.createButtons);
        break;
      default:
        break;
    }
    }
  }

  checkButtons(click, array) {
    var screen = this.screenPosition;
    for (var i = 0; i < array.length; i++) {
      var button = array[i];
      if (click.x >= button.x && click.x <= button.x + button.width && click.y >= button.y && click.y <= button.y + button.height) {
        switch (screen) {
          case 1:
            switch (button.text) {
              case "LOGIN":
                this.screenPosition = 2;
                break;
              case "CREATE":
                this.screenPosition = 3;
                break;
              default:
                this.screenPosition= 1;
                break;
            }
            break;
          case 2:
            //LOGIN HERE
            if (this.txtBoxUsername.value != "" && this.txtBoxPassword.value != "") {
              var data = {
                "username" : this.txtBoxUsername.value,
                "password" : this.txtBoxPassword.value
              }
              this.connection.emit('login', data);
              this.txtBoxUsername.value = "";
              this.txtBoxPassword.value = "";
              this.txtBoxUsername.style.display = "none";
              this.txtBoxPassword.style.display = "none";
            }
            break;
          case 3:
            //REGISTER HERE
            if (this.txtBoxUsername.value != "" && this.txtBoxPassword.value != "") {
              var data = {
                "username" : this.txtBoxUsername.value,
                "password" : this.txtBoxPassword.value
              }
              this.connection.emit('newUser', data);
              this.txtBoxUsername.value = "";
              this.txtBoxPassword.value = "";
              this.txtBoxUsername.style.display = "none";
              this.txtBoxPassword.style.display = "none";
              this.screenPosition = 1;
            }
            break;
          default:
            console.log("Unknown screen");
            break;
        }

      }
    }

  }

  drawHelperText() {
    ctx.fillStyle="#0eed07";
    ctx.font="30px Arial";
    ctx.fillText("Username", 520, 260);
    ctx.fillText("Password", 520, 400);
  }

  drawLogin() {
    this.drawBackground();
    this.drawStars();
    this.drawTitle();
    this.drawTextInput();
    this.drawHelperText();
    this.drawLoginButtons();
    this.drawResetButton();
  }

  drawCreate() {
    this.drawBackground();
    this.drawStars();
    this.drawTitle();
    this.drawTextInput();
    this.drawHelperText();
    this.drawCreateButtons();
    this.drawResetButton();
  }

  drawLoginButtons() {
    this.drawButton(this.loginButtons[0]);
  }

  drawCreateButtons() {
    this.drawButton(this.createButtons[0]);
  }

  drawTextInput() {
    this.txtBoxUsername.style.display = "inline-block";
    this.txtBoxPassword.style.display = "inline-block";
  }

}

class Game {
  constructor() {
    this.stars = this.createStars(5000);
    this.landButton = new Button("#ffee00", c.width - 190, 290, 175, 30, "LAND");
    this.takeOffButton = new Button("#ffee00", c.width - 186, 290, 175, 30, "TAKE OFF");
    this.upgradeButtons = this.createUpgradeButtons();

    this.connected = 1;

    this.position = [0, 0];
    this.username = "";
    this.currency = null;
    this.direction = 0;
    this.health = null;
    this.oldHealth = null;
    this.items = null;
    this.level = null;
    this.ship = [1,1,1,1,1];
    this.character = null;
    this.xp = null;

    this.playerCount = 0;

    this.otherPlayers = [];
    this.planets = [];
    this.nearbyPlanet = null;

    this.terrain = null;
    this.terrainType = null;
    this.landPosition = [-1,-1];
    this.landAnimation = 0;
    this.lastLandAnimation = new Date().getTime();
    this.takeOffAnimation = -1;
    this.lastTakeOffAnimation = new Date().getTime();
    this.otherLandPlayers = [];
    this.shipData = [];

    this.damageIndicator = null;
  }

  draw() {
    if (this.terrain == null) {
      this.drawBackground();
      this.drawStars();
      this.drawPlanets();
      this.drawOtherPlayers();
      this.drawPlayer();
      this.drawDashboard();
    } else {
      this.drawTerrain();
      this.drawShips();
      this.drawLandPlayer();
      this.drawDashboard();
      this.checkDamaged();
    }
  }

  clearScreen() {
    ctx.fillStyle="#000";
    ctx.fillRect(0, 0, c.width, c.height);
  }

  checkDamaged() {
    if (this.damageIndicator != null) {
      var currTime = new Date().getTime();
      ctx.fillStyle="#ff0000";
      ctx.globalAlpha=((this.damageIndicator - currTime)/300)*0.8;
      ctx.fillRect(0, 0, 1000, 800);
      ctx.globalAlpha=1;

      if (currTime >= this.damageIndicator)
        this.damageIndicator = null;
    } else {
      if (this.oldHealth > this.health) {
        if (this.damageIndicator == null) {
          this.damageIndicator = new Date().getTime() + 300;
        }
      }
    }
  }

  drawShips() {
    //ship animation bit landing
    if (this.landAnimation > 0) {
      var currTime = new Date().getTime();
      if (currTime >= this.lastLandAnimation + 2) {
        this.landAnimation -= 6;
        this.lastLandAnimation = currTime;
      }
    } else {
      this.landAnimation = 0;
    }

    //actually drawing the ship
    for (var i = 0; i < this.shipData.length; i++) {
      var playerYPos = Math.floor(this.terrain.length / 2) * 50 + 7;
      var playerXPos = Math.floor(this.terrain[0].length / 2) * 50 + 7;
      var xPos = this.shipData[i][1][0] - this.landPosition[0];
      var yPos = this.shipData[i][1][1] - this.landPosition[1];
      if (xPos > - 12 && xPos < 12 && yPos > -12 && yPos < 12) {
        ctx.fillStyle="#fff";
        ctx.fillRect(playerXPos + (xPos * 50), playerYPos + (yPos * 50) - this.landAnimation, 36, 36);
      }
    }
  }

  drawTerrain() {
    ctx.fillStyle="#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    /*ctx.font="10px Arial";
    for (var i = 0; i < this.terrain.length; i++) {
      ctx.fillText(this.terrain[i], 10, 10 + (i * 12));
    }*/
    for (var y = 0; y < this.terrain.length; y++) {
      var row = this.terrain[y];
      for (var x = 0; x < row.length; x++) {
        ctx.fillStyle=this.getTileColour(row[x]);
        ctx.fillRect(x * 50, y * 50, 50, 50);
        //ctx.fillStyle="#fff";
        //ctx.fillText(row[x], x*50 + 20, y*50 + 30);
      }
    }
    this.drawTerrainOtherPlayers();
  }

  drawTerrainOtherPlayers() {
    for (var i = 0; i < this.otherLandPlayers.length; i++) {
      //change this next line to get the correct character picture
      ctx.fillStyle="#f44242";
      var newPos = [550 - ((this.otherLandPlayers[i].position[0] + 1) * 50), 450 - ((this.otherLandPlayers[i].position[1] + 1) * 50)];
      ctx.fillStyle="#f44242";
      ctx.fillRect(newPos[0] + 7, newPos[1] + 7, 36, 36);
    }
  }

  drawLandPlayer() {
    if (this.landAnimation <= 0 && this.takeOffAnimation <= 0) {
      ctx.fillStyle="#a0099e";
      var yPos = Math.floor(this.terrain.length / 2);
      var xPos = Math.floor(this.terrain[0].length / 2);
      ctx.fillRect(xPos * 50 + 7, yPos * 50 + 7, 36, 36);
    }
  }

  getTileColour(val) {
    switch (val) {
      case "1":
        return "#a07975";
        break;
      case "2":
        return "#7a615e";
        break;
      case "3":
        return "#b7db62";
        break;
      case "4":
        return "#8adb62";
        break;
      case "5":
        return "#6fdb39";
        break;
      case "6":
        return "#09a046";
        break;
      case "w":
        return "#000";
        break;
      case "o":
        return "#0cfff2";
        break;
      case "d":
        return "#ffb20c";
        break;
      default:
        return "#74787a";
        break;
    }
  }

  createUpgradeButtons() {
    var rtnArray = [];

    //button for speed upgrade
    rtnArray.push(new Button("#202c99", c.width - 60, 430, 50, 40, ""));
    rtnArray.push(new Button("#202c99", c.width - 60, 490, 50, 40, ""));
    rtnArray.push(new Button("#202c99", c.width - 60, 550, 50, 40, ""));
    rtnArray.push(new Button("#202c99", c.width - 60, 610, 50, 40, ""));
    rtnArray.push(new Button("#202c99", c.width - 60, 670, 50, 40, ""));

    return rtnArray;
  }

  drawButton(btn) {
    var button = btn;
    ctx.fillStyle=button.colour;
    ctx.fillRect(button.x, button.y, button.width, button.height);
    ctx.font="30px Arial";
    ctx.fillStyle="#000";
    ctx.fillText(button.text, button.x + (button.width/2) - (ctx.measureText(button.text).width / 2), button.y + (button.height/2) + (parseInt(ctx.font) / 3));
  }

  drawUpgradeButtonsLol(btn) {
    var button = btn;
    ctx.fillStyle=button.colour;
    ctx.fillRect(button.x, button.y, button.width, button.height);
    ctx.font="20px Arial";
    ctx.fillStyle="#fff";
    ctx.fillText(button.text, button.x + (button.width/2) - (ctx.measureText(button.text).width / 2), button.y + (button.height/2) + (parseInt(ctx.font) / 3));
  }

  drawBackground() {
    ctx.fillStyle="#000";
    ctx.fillRect(0, 0, c.width, c.height);
  }

  drawPlayer() {
    var x = (c.width/2) - 105,
        y = (c.height / 2) - 35,
        width = 25,
        height = 40;

    this.drawShip(x, y, width, height, this.direction, "#fff", this.ship, "name");
  }

  drawShip(x, y, width, height, rot, colour, ship, username) {
    ctx.fillStyle=colour;
    ctx.strokeStyle="#000";
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);

    ctx.rotate(rot * Math.PI / 180);
    ctx.translate(-(x + width / 2), -(y + height / 2));

    var thrusterSize = 1.4;
    var thrusterX = x - 5;
    //checks if ship has bigger thrusters
    if (ship) {
      if (ship[0] > 3) {
        thrusterSize = 0.8;
        thrusterX = x - 17;
      }
    }

    //thruster sprite
    var sprite = spriter.getSprite("thruster");
    if (sprite != null) {
      ctx.drawImage(sprite.image,sprite.x,sprite.y,sprite.width,sprite.height,thrusterX, y + 5,(sprite.width)/thrusterSize,(sprite.height)/thrusterSize);
    }

    if (ship) {
      if (ship[0] > 3) {
        //left triangle
        ctx.beginPath();
        ctx.moveTo(x - 16,y + 1 + height);
        ctx.lineTo(x + (width)/2 - 16, y - 40 + height);
        ctx.lineTo(x + width - 16,y + 1 + height);
        ctx.lineTo(x - 16,y + 1 + height);
        ctx.closePath();
        ctx.fill();

        //right triangle
        ctx.beginPath();
        ctx.moveTo(x + 16,y + 1 + height);
        ctx.lineTo(x + (width)/2 + 16, y - 40 + height);
        ctx.lineTo(x + width + 16,y + 1 + height);
        ctx.lineTo(x + 16,y + 1 + height);
        ctx.closePath();
        ctx.fill();
      }
    }

    //ship body
    ctx.fillRect(x, y, width, height);

    //main middle triangle
    ctx.beginPath();
    ctx.moveTo(x,y + 1);
    ctx.lineTo(x + (width)/2, y - 60);
    ctx.lineTo(x + width,y + 1);
    ctx.lineTo(x,y + 1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle="#7ae4f9";
    ctx.fillRect(x + 5, y, 15, 8);

    ctx.restore();

    ctx.fillStyle="#18e061";

    ctx.font="20px Arial";
    ctx.fillText(username, x - 10, y + 75);
  }

  drawStars() {
    ctx.fillStyle="#fff";
    ctx.font="12px Arial";
    for (var i = 0; i < this.stars.length; i++) {
      var pos = this.getPositionRelative([this.stars[i].x, this.stars[i].y]);
      if (this.checkInView(pos)) {
        ctx.fillRect(pos[0], pos[1], this.stars[i].size, this.stars[i].size);
      }
    }
  }

  drawOtherPlayers() {
    for (var i = 0; i < this.otherPlayers.length; i++) {
      var otherPlayer = this.otherPlayers[i];
      var pos = this.getPositionRelative(otherPlayer.position);
      var x = pos[0],
          y = pos[1],
          width = 25,
          height = 50;

      this.drawShip(x, y, width, height, otherPlayer.direction, "#fff", otherPlayer.ship, otherPlayer.username);

    }
  }

  checkInView(pos) {
    if (pos[0] > 0 && pos[0] < c.width)
      return true;
    return false;
  }

  getPositionRelative(pos) {
    var rtnArray = [0, 0];
    rtnArray[0] = (c.width / 2) + pos[0] - this.position[0] - 105;
    rtnArray[1] = (c.height / 2) + pos[1] - this.position[1] - 35;
    return rtnArray;
  }

  drawPlanets() {
    ctx.fillStyle="#71f2a0";
    ctx.strokeStyle="#369659";
    for (var i = 0; i < this.planets.length; i++) {
      var planet = this.planets[i];
      var pos = this.getPositionRelative(planet.position);
      var radius = planet.size;

      switch (planet.type) {
        case "Earth":
          ctx.fillStyle="#a05555";
          ctx.strokeStyle="#774747";
          break;
        case "Ice":
          ctx.fillStyle="#49e3ff";
          ctx.strokeStyle="#3496a8";
          break;
        case "Fire":
          ctx.fillStyle="#ffa100";
          ctx.strokeStyle="#e20d0d";
          break;
        case "Waste":
          ctx.fillStyle="#318709";
          ctx.strokeStyle="#236006";
          break;
        default:
          ctx.fillStyle="#f6ff00";
          ctx.strokeStyle="#494943";
          break;
      }

      //planet text
      ctx.font="26px Arial";
      var textPosX = this.getPlanetTextPosition(pos[0], radius);
      ctx.fillText(planet.name, textPosX, pos[1] - radius/3);
      ctx.fillText(radius + "k km sq", textPosX, (pos[1] - radius/3) + 30);
      ctx.fillText(planet.type, textPosX, (pos[1] - radius/3) + 60);

      //actual planet
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], radius, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.closePath();
    }
  }

  getPlanetTextPosition(pos, radius) {
    if (pos < 150)
      return (pos + ((pos / 150) * (radius + 10)));
    else if (pos > 700 && pos < 850)
      return (pos + radius + 10 -  (pos - 700));
    else if (pos > 850)
        return pos;
    else
      return pos + radius + 10;
  }

  drawDashboard() {
    this.drawDashboardBackground();
    this.drawDashboardData();
    if (this.landPosition[0] == -1 && this.landPosition[1] == -1)
      this.drawPlanetDashboardData();
    else
      this.drawShipData();
    this.drawUpgradeButtons();
  }

  drawShipData() {
    ctx.font="28px Arial";
    ctx.fillStyle="#fff";
    ctx.fillText("Ship Location", c.width - 180, 260);
    var xPos, yPos;
    for (var i = 0; i < this.shipData.length; i++) {
      if (this.shipData[i][0] == this.username) {
        xPos = this.shipData[i][1][0] - this.landPosition[0];
        yPos = this.shipData[i][1][1] - this.landPosition[1];
      }
    }
    var compassText = "";
    if (yPos > 0) {
      compassText += "S";
    } else if (yPos < 0) {
      compassText += "N";
    }
    if (xPos > 0) {
      compassText += "E";
    } else if (xPos < 0) {
      compassText += "W";
    }
    ctx.fillText(compassText, c.width - 125, 290);

    if (compassText == "") {
      this.drawButton(this.takeOffButton);
    }

  }

  drawDashboardBackground() {
    ctx.fillStyle="#6d7075";
    ctx.fillRect(c.width - 200, 0, 200, c.height);
    ctx.fillStyle="#000";
    ctx.fillRect(c.width-200, 200, 200, 2);
    ctx.fillRect(c.width-200, 340, 200, 2);
  }

  drawDashboardData() {
    ctx.fillStyle="#fff";
    ctx.font="18px Arial";
    ctx.fillText("Name: " + this.username, c.width - 190, 30);
    ctx.fillText("Level: " + this.level, c.width - 190, 52);
    ctx.fillText("Edds: " + this.currency, c.width - 190, 74);
    ctx.fillText("Position: " + this.position, c.width - 190, 96);
    ctx.fillText("Players: " + this.playerCount, c.width - 190, 118);

    //hp indicator
    ctx.fillStyle="#e87a7a";
    ctx.fillRect(c.width - 185, 136, 165, 20);
    ctx.fillStyle="#ff0f0f";
    ctx.fillRect(c.width - 185, 136, (this.health / 100)*165, 20);
    var hpText = "HP: " + this.health + "/" + 100;
    ctx.fillStyle="#fff";
    ctx.fillText(hpText, c.width - 180, 153);

    var xpTarget = this.getXPBasedOnLevel(this.level);
    //xp indicator
    ctx.fillStyle="#5d93ea";
    ctx.fillRect(c.width - 185, 166, 165, 20);
    ctx.fillStyle="#1961d6";
    ctx.fillRect(c.width - 185, 166, (this.xp / xpTarget)*165, 20);
    var xpText = "XP: " + this.xp + "/" + xpTarget;
    //var textSize = ctx.measureText(xpText).width;
    ctx.fillStyle="#fff";
    ctx.fillText(xpText, c.width - 180, 183);
  }

  drawPlanetDashboardData() {
    ctx.font="28px Arial";
    ctx.fillStyle="#fff";
    ctx.fillText("No available", c.width - 175, 260);
    ctx.fillText("planets.", c.width - 150, 290);
    for (var i = 0; i < this.planets.length; i++) {
      var planet = this.planets[i];
      var pos = this.getPositionRelative(planet.position);
      //check if were over the planet
      if (pos[0] > 500 - (planet.size) && pos[0] < 500 + (planet.size) && pos[1] > 400 - (planet.size) && pos[1] < 400 + (planet.size)){
        ctx.fillStyle="#6d7075";
        ctx.fillRect(c.width - 200, 225, 200, 100);
        ctx.fillStyle="#fff";
        ctx.font="18px Arial";
        ctx.fillText("Planet name: " + planet.name, c.width - 190, 230);
        ctx.fillText("Size: " + planet.size + "k km sq", c.width - 190, 250);
        ctx.fillText("Type: " + planet.type, c.width - 190, 270);
        this.drawButton(this.landButton);
        this.nearbyPlanet = planet.name;
      }
    }
  }

  drawUpgradeButtons() {
    ctx.fillStyle="#fff";
    ctx.font="22px Arial";
    ctx.fillText("SHIP UPGRADES", c.width-190, 375);
    ctx.font="20px Arial";
    ctx.fillText("Lvl", c.width - 100, 410);
    ctx.fillText("Buy", c.width - 62, 410);
    ctx.fillText("Type", c.width - 180, 410);
    ctx.fillRect(c.width - 170, 422, 140, 1);

    //type name
    ctx.fillText("Thrusters", c.width - 192, 455);
    ctx.fillText("Shields", c.width - 192, 515);
    ctx.fillText("Dunno", c.width - 192, 575);
    ctx.fillText("Dunno", c.width - 192, 635);
    ctx.fillText("Health ++", c.width - 192, 695);
    //current level
    ctx.fillText(this.ship[0], c.width - 85, 455);
    ctx.fillText(this.ship[1], c.width - 85, 515);
    ctx.fillText(this.ship[2], c.width - 85, 575);
    ctx.fillText(this.ship[3], c.width - 85, 635);

    ctx.fillStyle="#252526";
    ctx.fillRect(c.width-180, 384, 160, 2);

    for (var i = 0; i < this.upgradeButtons.length; i++) {
      this.drawUpgradeButtonsLol(this.upgradeButtons[i]);
    }

    //costs
    var yPos = 456;
    for (var i = 0; i < this.ship.length; i++) {
      var cost = this.getCostOfUpgrade(this.ship[i]);
      if (this.currency - cost < 0)
        ctx.fillStyle="#ff0f0f";
      else
        ctx.fillStyle="#3bff0f";

      ctx.fillText(cost, c.width - 58, yPos);
      yPos += 60;
    }
  }

  getCostOfUpgrade(lvl) {
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
        return "Full";
        break;
    }
  }

  checkMouseClick(pos) {
    //first check land button
    if (this.landPosition[0] == -1 && this.landPosition[1] == -1) {
      var landBtn = this.landButton;
      if (pos.x > landBtn.x && pos.x < landBtn.x + landBtn.width & pos.y > landBtn.y && pos.y < landBtn.y + landBtn.height && this.nearbyPlanet != null && this.terrain == null) {
        connection.emit('landAttempt', this.nearbyPlanet);
      }
    } else {
      var takeOffButton = this.takeOffButton;
      if (pos.x > takeOffButton.x && pos.x < takeOffButton.x + takeOffButton.width & pos.y > takeOffButton.y && pos.y < takeOffButton.y + takeOffButton.height) {
        connection.emit('takeOff');
      }
    }

    //check here for the ship ugrade buttons
    for (var i = 0; i < this.upgradeButtons.length; i++) {
      if (this.upgradeButtons[i].isInside(pos)) {
        connection.emit('shipupgrade', i);
      }
    }
  }

  getXPBasedOnLevel(level) {
    switch (level) {
      case 1:
        return 50;
        break;
      case 2:
        return 80;
        break;
      case 3:
        return 130;
        break;
      case 4:
        return 200;
        break;
      case 5:
        return 300;
        break;
      default:
        return 10000;
        break;
    }
  }

  movementListener() {
    var keyPresses = {
      "up" : false,
      "right" : false,
      "down" : false,
      "left" : false
    };
    //Directions to move in
    if (Key.isDown(Key.UP)) keyPresses.up = true;
    if (Key.isDown(Key.RIGHT)) keyPresses.right = true;
    if (Key.isDown(Key.DOWN)) keyPresses.down = true;
    if (Key.isDown(Key.LEFT)) keyPresses.left = true;
    if ((keyPresses.up) || (keyPresses.down) || (keyPresses.left) || (keyPresses.right)) {
      connection.emit('keypress', keyPresses);
      this.nearbyPlanet = null;
    }
  }

  createStars(num) {
    var tempArray = [];
    for (var i = 0; i < num; i++) {
      var star = new Star(null, [5000, 5000]);
      tempArray.push(star);
    }
    return tempArray;
  }
}

class Connection {
  constructor() {
    this.socket = io.connect("http://localhost:8000");
    this.socket.on('connect', this.connectMessage);
    this.socket.on('loginconfirm', this.loginConfirm);
    this.socket.on('serverupdate', this.serverUpdate);
    this.socket.on('landserveremit', this.landServerEmit);
  }

  connectMessage() {
    console.log("We have connect-off");
  }

  loginConfirm(data) {
    if (!data.data) {
      window.alert("Wrong username or password");
    } else {
      screen.txtBoxUsername.style.display = "none";
      screen.txtBoxPassword.style.display = "none";
      console.log("Logged in");
      screen.screenPosition = 4;
    }
  }

  serverUpdate(data) {
    game.terrain = null;
    game.position = [data.data.position[0], data.data.position[1]];
    game.username = data.data.username;
    game.currency = data.data.currency;
    game.direction = data.data.direction;
    game.health = data.data.health;
    game.items = data.data.items;
    game.level = data.data.level;
    game.ship = data.data.ship;
    game.character = data.data.character;
    game.xp = data.data.xp;
    game.playerCount = data.playerCount;

    game.otherPlayers = data.otherPlayerData;
    game.planets = data.planetData;

    game.landPosition = [-1,-1];
    game.terrain = null;
    game.terrainType = null;

  }

  landServerEmit(data) {
    game.position = [data.data.position[0], data.data.position[1]];
    game.username = data.data.username;
    game.currency = data.data.currency;
    game.direction = data.data.direction;
    game.oldHealth = game.health;
    game.health = data.data.health;
    game.items = data.data.items;
    game.level = data.data.level;
    game.ship = data.data.ship;
    game.character = data.data.character;
    game.xp = data.data.xp;
    game.playerCount = data.playerCount;

    if (game.landPosition[0] == -1 && game.landPosition[1] == -1) {
      game.landAnimation = 400;
    }

    game.landPosition = data.data.landPosition;
    game.terrain = data.terrainData[0];
    game.terrainType = data.terrainData[1];
    game.shipData = data.shipData;

    game.otherLandPlayers = data.terrainPlayerData;
  }

  emit(target, data) {
    this.socket.emit(target, data);
  }
}

class Star {
  constructor(grav, limits) {
    this.pull = grav;
    this.x = Math.floor(Math.random() * limits[0]) + 0;
    this.y = Math.floor(Math.random() * limits[1]) - 40;
    this.size = Math.floor(Math.random() * 3) + 1;
    this.speed = null;
  }
}

class Button {
  constructor(colour, x, y, width, height, text) {
    this.colour = colour;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
  }

  isInside(click) {
    if (click.x > this.x && click.x < this.x + this.width && click.y > this.y && click.y < this.y + this.height)
      return true;
    return false;
  }
}


//create a new socket.io connection
var connection = new Connection();

//creates a new game class
var game = new Game();
