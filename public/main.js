let canvas;
let ctx;
let socket;
let scores;
const eatingAudio = new Audio("./assets/crunch.mp3");
const gameOverAudio = new Audio("./assets/gameover.wav");

window.onload = () => {
  scores = document.getElementById("scores");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  document.addEventListener("keydown", keyPush);
  startGame();
};

function startGame() {
  socket = io({ reconnection: false });
  socket.on("frame", (data) => {
    drawBackground(data);
    drawSnakes(data);
    drawApple(data);
    writeScores(data, socket.id);
  });

  socket.on("gameover", () => {
    socket.disconnect();
    gameOver();
  });

  socket.on("eat", () => {
    eatingAudio.play();
  });
}
