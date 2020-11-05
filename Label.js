export default class Label {
  constructor(x, y, text, count) {
    this.x = x;
    this.y = y;
    this.text = text
    this.count = count;
  }

  render(ctx) {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`${this.text} ${this.count}`, this.x, this.y);
  }
}
