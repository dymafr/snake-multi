let canvas;
let ctx;
let socket;
const eatingAudio = new Audio("./assets/crunch.mp3");
const gameOverAudio = new Audio("./assets/gameover.wav");

window.onload = () => {
  canvas = document.getElementById("gc");
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
  });

  socket.on("gameover", () => {
    socket.disconnect();
    gameOver();
  });

  socket.on("eat", () => {
    eatingAudio.play();
  });
}
