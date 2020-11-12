export default class Sprite {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
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
