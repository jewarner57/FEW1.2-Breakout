import Brickrow from './Brickrow.js';

export default class Bricks {
  constructor(brickColumnCount,
    brickWidth, brickHeight, brickOffsetLeft, brickOffsetTop, colorStart) {
    this.brickColumnCount = brickColumnCount;
    this.brickWidth = brickWidth;
    this.brickHeight = brickHeight;
    this.brickOffsetLeft = brickOffsetLeft;
    this.brickOffsetTop = brickOffsetTop;
    this.colorStart = colorStart;
    this.brickList = [];
    this.setup();
  }

  setup() {
    for (let i = 0; i <= 2; i += 2) {
      this.brickList[i] = new Brickrow(
        this.brickColumnCount, i, this.brickWidth, this.brickHeight, this.brickOffsetLeft, this.brickOffsetTop, this.colorStart, '100%', '60%',
      );
    }
    this.brickList[1] = new Brickrow(
      this.brickColumnCount * 2, 1, 32.5, this.brickHeight, this.brickOffsetLeft, this.brickOffsetTop, this.colorStart, '100%', '60%',
    );
  }

  drawBricks(ctx) {
    for (let r = 0; r < this.brickList.length; r += 1) {
      for (let c = 0; c < this.brickList[r].row.length; c += 1) {
        if (this.brickList[r].row[c].status === 1) {
          this.brickList[r].row[c].render(ctx);
        }
      }
    }
  }
}
