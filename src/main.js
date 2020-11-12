import Ball from './Ball.js';
import Paddle from './Paddle.js';
import Brick from './Brick.js';
import Brickrow from './Brickrow.js';
import Bricks from './Bricks.js'
import Label from './Label.js';

/*
# # # # # # # # # #
constants
# # # # # # # # # #
*/

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

/*
# # # # # # # # # #
variables
# # # # # # # # # #
*/

let score = 0;
let lives = 3;

let rightPressed = false;
let leftPressed = false;
let levelFinished = false;

// Object Delcarations
const ball = new Ball(10, canvas.width / 2, canvas.height - 30);
const paddle = new Paddle((canvas.width - 75) / 2, canvas.height - 10, 75, 10);

const livesLabel = new Label(canvas.width - 65, 20, `Lives: ${lives}`);
const scoreLabel = new Label(8, 20, `Score: ${score}`);
const endMessage = new Label(canvas.width / 2 - (5 * 10), canvas.height / 2, '', '#000', 'Arial', '20px');

const bricks = new Bricks(5, 75, 20, 30, 30, (Math.random() * 200) + 10);

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

function decrementLives() {
  lives -= 1;
  livesLabel.text = `Lives: ${lives}`;
  paddle.x = (canvas.width - paddle.width) / 2;
  ball.resetBall();
}

function endGameMessage() {
  if (lives <= 0) {
    endMessage.text = 'Game Over.';
    endMessage.render(ctx);
  } else if (levelFinished) {
    endMessage.text = 'You Won!';
    endMessage.render(ctx);
  }
}

function blockCollision() {
  let blockCount = 0;
  for (let r = 0; r < bricks.brickList.length; r += 1) {
    for (let c = 0; c < bricks.brickList[r].row.length; c += 1) {
      const b = bricks.brickList[r].row[c];
      blockCount += 1;
      if (b.status === 1) {
        if (
          ball.x > b.x - ball.radius
          && ball.x < b.x + bricks.brickList[r].row[c].width + ball.radius
          && ball.y > b.y - ball.radius
          && ball.y < b.y + bricks.brickList[r].row[c].height + ball.radius
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          score += 1;
          scoreLabel.text = `Score: ${score}`;
        }
      }
    }
  }
  if (score >= blockCount) {
    levelFinished = true;
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
      decrementLives();
    }
  }
}

function draw() {
  if (lives > 0 && !levelFinished) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.render(ctx);
    blockCollision();
    canvasBorderCollision();
    ball.moveBy(ball.dx, ball.dy);

    paddle.render(ctx, canvas);
    paddle.movePaddle(rightPressed, leftPressed, canvas);

    bricks.drawBricks(ctx);

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

draw();
