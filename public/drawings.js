function drawBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawApple(data) {
  const map = data.apple.map;
  ctx.fillStyle = "red";
  ctx.fillRect(
    data.apple.pommeX * map.gridSize,
    data.apple.pommeY * map.gridSize,
    map.gridSize,
    map.gridSize
  );
}

function drawSnakes(data) {
  const map = data.apple.map;
  const players = data.players;
  players.forEach((player) => {
    if (player.id === socket.id) {
      ctx.fillStyle = "lime";
    } else {
      ctx.fillStyle = "red";
    }
    for (let i = 0; i < player.positionsQueue.length; i++) {
      ctx.fillRect(
        player.positionsQueue[i].x * map.gridSize,
        player.positionsQueue[i].y * map.gridSize,
        map.gridSize - 2,
        map.gridSize - 2
      );
    }
  });
}
