// eslint-disable-next-line import/extensions
import HSLToHex from './HSLToHex.js';

/*
# # # # # # # # # #
constants
# # # # # # # # # #
*/

const brickHeight = 20;
const brickPadding = 10;
const bricks = [];
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const paddleHeight = 10;
const paddleWidth = 75;
const ballRadius = 10;
const black = '#000';
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickColumnCount = 5;
const brickWidth = 75;

/*
# # # # # # # # # #
variables
# # # # # # # # # #
*/

let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

let lives = 3;
let score = 0;
let levelFinished = false;

/*
# # # # # # # # # #
functions
# # # # # # # # # #
*/

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

function blockCollision() {
  let blockCount = 0;
  for (let r = 0; r < bricks.length; r += 1) {
    for (let c = 0; c < bricks[r].length; c += 1) {
      const b = bricks[r][c];
      blockCount += 1;
      if (b.status === 1) {
        if (
          x > b.x - ballRadius
          && x < b.x + bricks[r][c].width + ballRadius
          && y > b.y - ballRadius
          && y < b.y + bricks[r][c].height + ballRadius
        ) {
          dy = -dy;
          b.status = 0;
          score += 1;
        }
      }
    }
  }
  if (score >= blockCount) {
    levelFinished = true;
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = black;
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = black;
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawMessage(message) {
  ctx.font = '20px Arial';
  ctx.fillStyle = black;
  ctx.fillText(message, canvas.width / 2 - (5 * message.length), canvas.height / 2);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = black;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = black;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let r = 0; r < bricks.length; r += 1) {
    for (let c = 0; c < bricks[r].length; c += 1) {
      if (bricks[r][c].status === 1) {
        ctx.beginPath();
        ctx.rect(bricks[r][c].x, bricks[r][c].y, bricks[r][c].width, bricks[r][c].height);
        ctx.fillStyle = bricks[r][c].color;

        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function createBrickrow(columnCount, rowNumber, width, height, offsetLeft, offsetTop, h, s, l) {
  const row = [];
  for (let i = 0; i < columnCount; i += 1) {
    const brickX = (i * (width + brickPadding)) + offsetLeft;
    const brickY = (rowNumber * (height + brickPadding)) + offsetTop;

    row.push({
      x: brickX,
      y: brickY,
      width,
      height,
      status: 1,
      color: HSLToHex(i * (1 / columnCount) * 100 + h, s, l),
    });
  }
  return row;
}

function movePaddle() {
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
}

function endGameMessage() {
  if (lives <= 0) {
    drawMessage('Game Over');
  } else if (levelFinished) {
    drawMessage('You Won!');
  }
}

function moveBall() {
  x += dx;
  y += dy;
}

function resetBall() {
  lives -= 1;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
}

function canvasBorderCollision() {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius) {
      dy = -dy;
    } else {
      resetBall();
    }
  }
}

function draw() {
  if (lives > 0 && !levelFinished) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    blockCollision();
    canvasBorderCollision();
    moveBall();

    drawPaddle();
    movePaddle();

    drawBricks();

    drawScore();
    drawLives();
    endGameMessage();

    window.requestAnimationFrame(draw);
  }
}

/*
# # # # # # # # # #
initialization code
# # # # # # # # # #
*/

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

for (let i = 0; i <= 2; i += 2) {
  bricks[i] = createBrickrow(
    brickColumnCount, i, brickWidth, brickHeight, brickOffsetLeft, brickOffsetTop, 170, 100, 60,
  );
}
bricks[1] = createBrickrow(
  brickColumnCount * 2, 1, 32.5, brickHeight, brickOffsetLeft, brickOffsetTop, 170, 100, 60,
);

draw();
