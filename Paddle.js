import Sprite from './Sprite.js';

export default class Paddle extends Sprite {
  constructor(x, y, width, height, color = '#000') {
    super(x, y, color);
    this.width = width;
    this.height = height;
  }

  movePaddle(rightPressed, leftPressed, canvas) {
    if (rightPressed) {
      this.x += 7;
      if (this.x + this.width > canvas.width) {
        this.x = canvas.width - this.width;
      }
    } else if (leftPressed) {
      this.x -= 7;
      if (this.x < 0) {
        this.x = 0;
      }
    }
  }

  render(ctx, canvas) {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
  }
}
