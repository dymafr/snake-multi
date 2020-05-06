const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const Player = require("./Player.js");
const Game = require("./Game.js");
const { v4: uuidv4 } = require("uuid");
let waitingPlayers = [];

if (process.env.PORT) {
  http.listen(process.env.PORT);
} else {
  http.listen(80);
}

app.use(express.static(path.join(__dirname, "../public")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/index.html"))
);

io.on("connection", (socket) => {
  const player = new Player(socket.id);
  let game;
  waitingPlayers.push(player);

  if (waitingPlayers.length === 2) {
    const gameRoom = uuidv4();
    io.sockets.connected[waitingPlayers[0].id].join(gameRoom);
    io.sockets.connected[waitingPlayers[1].id].join(gameRoom);
    game = new Game(waitingPlayers, gameRoom, io);
    game.initGame();
    waitingPlayers = [];
  }

  socket.on("disconnect", () => {
    waitingPlayers = waitingPlayers.filter((p) => p.id !== socket.id);
    if (game) {
      game.players = game.players.filter((p) => p.id !== socket.id);
      if (game.players < 2) {
        game.endGame();
      }
    }
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

module.exports = io;
