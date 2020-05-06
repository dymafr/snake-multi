const Map = require("./Map.js");
const Apple = require("./Apple.js");
const io = require("./index.js");

module.exports = class Game {
  constructor(players, gameRoom, server) {
    this.gameInterval;
    this.players = players;
    this.map = new Map();
    this.apple;
    this.gameRoom = gameRoom;
    this.server = server;
  }

  initGame() {
    this.apple = new Apple(this.map);
    this.apple.genAppleCoordinates();
    this.gameInterval = setInterval(() => {
      this.gameFrame();
      this.server
        .to(this.gameRoom)
        .emit("frame", { apple: this.apple, players: this.players });
    }, 1000 / 20);
  }

  gameFrame() {
    this.setNextPosition();
    this.checkCollisions();
    this.moveSnakePosition();
  }

  moveSnakePosition() {
    this.players.forEach((player) => {
      player.positionsQueue.push({ x: player.positionX, y: player.positionY });
      if (player.positionsQueue.length > player.longueurQueue) {
        player.positionsQueue.shift();
      }
    });
  }

  checkCollisions() {
    this.players.forEach((player, index) => {
      if (
        this.apple.pommeX === player.positionX &&
        this.apple.pommeY === player.positionY
      ) {
        player.longueurQueue++;
        player.score++;
        this.server.to(this.gameRoom).emit("eat");
        this.apple.genAppleCoordinates(this.players);
      }

      for (let { x, y } of player.positionsQueue) {
        if (x === player.positionX && y === player.positionY) {
          this.server.to(this.gameRoom).emit("gameover", player.id);
          this.players.splice(index, 1);
        }
      }
    });
  }

  setNextPosition() {
    this.players.forEach((player) => {
      player.positionX += player.velociteHorizontale;
      player.positionY += player.velociteVerticale;
      player.previousXV = player.velociteHorizontale;
      player.previousYV = player.velociteVerticale;
      if (player.positionX < 0) {
        player.positionX = this.map.tileCount - 1;
      }
      if (player.positionX > this.map.tileCount - 1) {
        player.positionX = 0;
      }
      if (player.positionY < 0) {
        player.positionY = this.map.tileCount - 1;
      }
      if (player.positionY > this.map.tileCount - 1) {
        player.positionY = 0;
      }
    });
  }

  endGame() {
    clearInterval(this.gameInterval);
  }
};
