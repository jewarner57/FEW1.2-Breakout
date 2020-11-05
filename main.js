import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Brick from './Brick.js';
import Brickrow from './Brickrow.js';
import Label from './Label.js';

/*
# # # # # # # # # #
constants
# # # # # # # # # #
*/

const colorStart = (Math.random() * 200) + 10;

const bricks = [];
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const brickHeight = 20;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const brickColumnCount = 5;
const brickWidth = 75;

/*
# # # # # # # # # #
variables
# # # # # # # # # #
*/

let rightPressed = false;
let leftPressed = false;
let levelFinished = false;

// Object Delcarations
const ball = new Ball(10, canvas.width / 2, canvas.height - 30);
const paddle = new Paddle((canvas.width - 75) / 2, canvas.height - 10, 75, 10);

const livesLabel = new Label(canvas.width - 65, 20, 'Lives:', 3);
const scoreLabel = new Label(8, 20, 'Score: ', 0);

/*
# # # # # # # # # #
functions
# # # # # # # # # #
*/

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvas.width) {
      paddle.x = canvas.width - paddle.width;
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
    for (let c = 0; c < bricks[r].row.length; c += 1) {
      const b = bricks[r].row[c];
      blockCount += 1;
      if (b.status === 1) {
        if (
          ball.x > b.x - ball.radius
          && ball.x < b.x + bricks[r].row[c].width + ball.radius
          && ball.y > b.y - ball.radius
          && ball.y < b.y + bricks[r].row[c].height + ball.radius
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          scoreLabel.count += 1;
        }
      }
    }
  }
  if (scoreLabel.score >= blockCount) {
    levelFinished = true;
  }
}

function drawMessage(message) {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(message, canvas.width / 2 - (5 * message.length), canvas.height / 2);
}

function drawBricks() {
  for (let r = 0; r < bricks.length; r += 1) {
    for (let c = 0; c < bricks[r].row.length; c += 1) {
      if (bricks[r].row[c].status === 1) {
        bricks[r].row[c].render(ctx);
      }
    }
  }
}

function resetGame() {
  livesLabel.count -= 1;
  paddle.x = (canvas.width - paddle.width) / 2;
  ball.resetBall();
}

function endGameMessage() {
  if (livesLabel.count <= 0) {
    drawMessage('Game Over');
  } else if (levelFinished) {
    drawMessage('You Won!');
  }
}

function canvasBorderCollision() {
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }

  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height) {
    if (ball.x > paddle.x - ball.radius && ball.x < paddle.x + paddle.width + ball.radius) {
      ball.dy = -ball.dy;
    } else {
      resetGame();
    }
  }
}

function draw() {
  if (livesLabel.count > 0 && !levelFinished) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.render(ctx);
    blockCollision();
    canvasBorderCollision();
    ball.moveBy(ball.dx, ball.dy);

    paddle.render(ctx, canvas);
    paddle.movePaddle(rightPressed, leftPressed, canvas);

    drawBricks();

    livesLabel.render(ctx);
    scoreLabel.render(ctx);
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
  bricks[i] = new Brickrow(
    brickColumnCount, i, brickWidth, brickHeight, brickOffsetLeft, brickOffsetTop, colorStart, '100%', '60%',
  );
  bricks[i].createBricks();
}
bricks[1] = new Brickrow(
  brickColumnCount * 2, 1, 32.5, brickHeight, brickOffsetLeft, brickOffsetTop, colorStart, '100%', '60%',
);
bricks[1].createBricks();

draw();
