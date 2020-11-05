export default class Sprite {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}
