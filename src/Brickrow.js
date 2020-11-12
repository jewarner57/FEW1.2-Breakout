import Brick from './Brick.js';

export default class Brickrow {
  constructor(columnCount, rowNumber, width, height, offsetLeft, offsetTop, h, s, l) {
    this.columnCount = columnCount;
    this.rowNumber = rowNumber;
    this.width = width;
    this.height = height;
    this.offsetLeft = offsetLeft;
    this.offsetTop = offsetTop;
    this.brickPadding = 10;
    this.h = h;
    this.s = s;
    this.l = l;
    this.row = [];
    this.createBricks();
  }

  createBricks() {
    for (let i = 0; i < this.columnCount; i += 1) {
      const brickX = (i * (this.width + this.brickPadding)) + this.offsetLeft;
      const brickY = (this.rowNumber * (this.height + this.brickPadding)) + this.offsetTop;

      this.row.push(
        new Brick(
          brickX,
          brickY,
          this.width,
          this.height,
          `hsl(${(i * (1 / this.columnCount) * 100 + this.h)}, ${this.s}, ${this.l})`,
        ),
      );
    }
  }
}
