const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app).listen(3000);
const io = require("socket.io")(http);

const Player = require("./Player.js");
const Map = require("./Map.js");
const Apple = require("./Apple.js");

app.use(express.static(path.join(__dirname, "../public")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/index.html"))
);

let players = [];
const map = new Map();
const apple = new Apple(map);
apple.genAppleCoordinates();

setInterval(() => {
  gameFrame();
  io.emit("frame", { apple, players });
}, 1000 / 15);

function gameFrame() {
  setNextPosition();
  checkCollisions();
  moveSnakePosition();
}

io.on("connection", (socket) => {
  console.log("New Player");

  const player = new Player(socket.id);
  players.push(player);

  socket.on("disconnect", () => {
    players = players.filter((p) => p.id !== socket.id);
  });

  socket.on("move", (arrow) => {
    switch (arrow) {
      case "ArrowUp":
        player.velociteHorizontale = 0;
        player.velociteVerticale = -1;
        break;
      case "ArrowDown":
        player.velociteHorizontale = 0;
        player.velociteVerticale = 1;
        break;
      case "ArrowRight":
        player.velociteHorizontale = 1;
        player.velociteVerticale = 0;
        break;
      case "ArrowLeft":
        player.velociteHorizontale = -1;
        player.velociteVerticale = 0;
        break;
    }
    if (player.previousYV === -player.velociteVerticale) {
      player.velociteVerticale = player.previousYV;
    }
    if (player.previousXV === -player.velociteHorizontale) {
      player.velociteHorizontale = player.previousXV;
    }
  });
});

function setNextPosition() {
  players.forEach((player) => {
    player.positionX += player.velociteHorizontale;
    player.positionY += player.velociteVerticale;
    player.previousXV = player.velociteHorizontale;
    player.previousYV = player.velociteVerticale;
    if (player.positionX < 0) {
      player.positionX = map.tileCount - 1;
    }
    if (player.positionX > map.tileCount - 1) {
      player.positionX = 0;
    }
    if (player.positionY < 0) {
      player.positionY = map.tileCount - 1;
    }
    if (player.positionY > map.tileCount - 1) {
      player.positionY = 0;
    }
  });
}

function moveSnakePosition() {
  players.forEach((player) => {
    player.positionsQueue.push({ x: player.positionX, y: player.positionY });
    if (player.positionsQueue.length > player.longueurQueue) {
      player.positionsQueue.shift();
    }
  });
}

function checkCollisions() {
  players.forEach((player, index) => {
    if (
      apple.pommeX === player.positionX &&
      apple.pommeY === player.positionY
    ) {
      player.longueurQueue++;
      apple.genAppleCoordinates();
    }

    for ({ x, y } of player.positionsQueue) {
      if (x === player.positionX && y === player.positionY) {
        io.to(player.id).emit("gameover");
        players.splice(index, 1);
      }
    }
  });
}
