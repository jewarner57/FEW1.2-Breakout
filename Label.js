import Sprite from './Sprite.js';

export default class Label extends Sprite {
  constructor(x, y, text, color = '#000', font = 'Arial', fontSize = '14px', align = 'left') {
    super(x, y, color);
    this.text = text;
    this.font = font;
    this.fontSize = fontSize;
    this.align = align;
  }

  render(ctx) {
    ctx.font = `${this.fontSize} ${this.font}`;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.fillText(this.text, this.x, this.y);
  }
}
