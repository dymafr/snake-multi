module.exports = class Apple {
  constructor(map) {
    this.pommeX;
    this.pommeY;
    this.map = map;
  }

  genAppleCoordinates(players) {
    this.pommeX = Math.floor(Math.random() * this.map.tileCount);
    this.pommeY = Math.floor(Math.random() * this.map.tileCount);
    if (players) {
      const playersPosition = players
        .map((player) => player.positionsQueue)
        .flat();
      for (let { x, y } of playersPosition) {
        if (x === this.pommeX && y === this.pommeY) {
          this.genAppleCoordinates(players);
        }
      }
    }
  }
};
