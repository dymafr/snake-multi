module.exports = class Player {
  constructor(id) {
    this.id = id;
    this.velociteHorizontale = 1;
    this.velociteVerticale = 0;
    this.previousXV = 0;
    this.previousYV = 0;
    this.positionX = 0;
    this.positionY = 0;
    this.longueurQueue = 10;
    this.positionsQueue = [];
    this.isGameOver = false;
  }
};
