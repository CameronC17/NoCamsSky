var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    || window.oRequestAnimationFrame      || window.msRequestAnimationFrame     || null ;

//Creating instances of canvas and the canvas' 2d drawing
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

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
//spriter.loadSprites(images);

function mainLoop() {
  clearScreen();
  if (!loaded) {
    drawLoading();
    checkLoad();
  } else {
    if (screen.screenPosition != 4)
      screen.draw();
    else {
      game.draw();
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

// mouse stuff

function saveMouse(e) {
  var pos = getMousePos(e);
  if (pos.x >= 0 && pos.x <= c.width && pos.y >= 0 && pos.y <= c.height) {
    if (screen != null) {
      screen.checkMouseClick(pos);
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
    this.position = [2000, 2000];
  }

  draw() {
    this.drawBackground();
    this.drawStars();
    this.drawPlayer();
    this.drawDashboard();
  }

  drawBackground() {
    ctx.fillStyle="#000";
    ctx.fillRect(0, 0, c.width, c.height);
  }

  drawPlayer() {
    ctx.fillStyle="#23e564";
    ctx.fillRect((c.width/2) - 105, (c.height / 2) - 5, 10, 10);
  }

  drawStars() {
    ctx.fillStyle="#fff";
    for (var i = 0; i < this.stars.length; i++) {
      var pos = this.getPositionRelative([this.stars[i].x, this.stars[i].y]);
      if (this.checkInView(pos)) {
        ctx.fillRect(pos[0], pos[1], this.stars[i].size, this.stars[i].size);
      }
    }
  }

  checkInView(pos) {
    if (pos[0] > 0 && pos[0] < c.width)
      return true;
    return false;
  }

  getPositionRelative(pos) {
    var rtnArray = [0, 0];
    rtnArray[0] = (c.width / 2) + pos[0] - this.position[0];
    rtnArray[1] = (c.height / 2) + pos[1] - this.position[0];
    return rtnArray;
  }

  drawDashboard() {
    ctx.fillStyle="#6d7075";
    ctx.fillRect(c.width - 200, 0, 200, c.height);
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
  }

  connectMessage() {
    console.log("We have connect-off");
  }

  loginConfirm(data) {
    if (!data.data) {
      console.log("Wrong username or password");
    } else {
      console.log("Logged in");
      screen.screenPosition = 4;
    }
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
}


//create a new socket.io connection
var connection = new Connection();

//creates a new game class
var game = new Game();
