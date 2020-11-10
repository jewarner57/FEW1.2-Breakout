import Sprite from './Sprite.js';

export default class Ball extends Sprite {
  constructor(radius, x, y, color = '#000') {
    super(x, y, color);
    this.startX = x;
    this.startY = y;
    this.radius = radius;
    this.dy = -2;
    this.dx = 2;
  }

  resetBall() {
    this.x = this.startX;
    this.y = this.startY;
    this.dx = 2;
    this.dy = -2;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
  }
}
