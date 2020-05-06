function keyPush(evt) {
  socket.emit("move", evt.key);
  switch (evt.key) {
    case "f":
    case "e":
      enterFullScreen();
      break;
    case "Enter":
      startGame();
    default:
      break;
  }
}

function enterFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

function waitForOpponent() {
  let blink = true;
  waitingId = setInterval(() => {
    drawBackground();
    blink = !blink;
    if (blink) {
      ctx.font = "60px Impact";
      ctx.fillStyle = "White";
      ctx.textAlign = "center";
      ctx.fillText(
        "En attente d'un joueur",
        canvas.width / 2,
        canvas.height / 2
      );
    }
  }, 800);
}

function gameOver() {
  drawBackground();
  ctx.font = "60px Impact";
  ctx.fillStyle = "White";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  ctx.font = "italic 20px Impact";
  ctx.fillText(
    "-Press Enter to restart-",
    canvas.width / 2,
    canvas.height / 2 + 50
  );
  gameOverAudio.play();
}
