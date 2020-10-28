// eslint-disable-next-line import/extensions
import HSLToHex from './HSLToHex.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// brick vars
let brickColumnCount = 5;
let brickWidth = 75;
const brickRowCount = 3;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let r = 0; r < brickRowCount; r += 1) {
  bricks[r] = [];
  for (let c = 0; c < brickColumnCount; c += 1) {
    if (r === 1) {
      brickColumnCount = 10;
    } else {
      brickColumnCount = 5;
    }
    bricks[r][c] = { x: 0, y: 0, status: 1 };
  }
}

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const ballRadius = 10;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

let lives = 3;
let score = 0;
let levelFinished = false;

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
    if (paddleX < 0) {
      paddleX = 0;
    }
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// listen for key presses
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function collisionDetection() {
  for (let r = 0; r < brickRowCount; r += 1) {
    for (let c = 0; c < brickColumnCount; c += 1) {
      if (r === 1) {
        brickWidth = 32.5;
        brickColumnCount = 10;
      } else {
        brickWidth = 75;
        brickColumnCount = 5;
      }

      const b = bricks[r][c];
      if (b.status === 1) {
        if (
          x > b.x - ballRadius
          && x < b.x + brickWidth + ballRadius
          && y > b.y - ballRadius
          && y < b.y + brickHeight + ballRadius
        ) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score >= 20) {
            levelFinished = true;
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawMessage(message) {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#000000';
  ctx.fillText(message, canvas.width / 2 - (5 * message.length), canvas.height / 2);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#000000';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let r = 0; r < brickRowCount; r += 1) {
    for (let c = 0; c < brickColumnCount; c += 1) {
      if (r === 1) {
        brickWidth = 32.5;
        brickColumnCount = 10;
      } else {
        brickWidth = 75;
        brickColumnCount = 5;
      }
      if (bricks[r][c].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[r][c].x = brickX;
        bricks[r][c].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);

        if (brickWidth > 40) {
          ctx.fillStyle = HSLToHex(c * 10 + 170, 100, 60);
        }
        else {
          ctx.fillStyle = HSLToHex(c * 5 + 170, 100, 50);
        }

        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  if (lives <= 0) {
    drawMessage('Game Over');
  } else if (levelFinished) {
    drawMessage('You Won!');
  }

  if (lives > 0 && !levelFinished) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();

    if (rightPressed) {
      paddleX += 7;
      if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
      }
    } else if (leftPressed) {
      paddleX -= 7;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
      if (x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius) {
        dy = -dy;
      } else {
        lives -= 1;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }

    x += dx;
    y += dy;

    window.requestAnimationFrame(draw);
  }
}

draw();
