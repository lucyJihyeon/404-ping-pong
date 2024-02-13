//create a 2D canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const marginTop = 150;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "#33ff00";
ctx.strokeStyle = "#33ff00";

const keyPressed = [];
//up-arrow
const KeyUp = 38;
//down-arrow
const KeyDown = 40;

//when a key is pressed, the keycode of the pressed key is stored in the 'keyPressed' array with a value of true
window.addEventListener("keydown", function (e) {
  keyPressed[e.keyCode] = true;
});
//when a key is released, the keycode of the corresponding key is stored in the 'keyPressed' array with a value of false
window.addEventListener("keyup", function (e) {
  keyPressed[e.keyCode] = false;
});

//converting the x coordinate and y coordinate as a properties in an object
function vec2(x, y) {
  return { x: x, y: y };
}

function ballCollision(ball) {
  //if the y coordinate of the bottom of the ball (the centerY + radius) touches the bottom side of the canvas, the ball moves upward
  if (ball.pos.y + ball.radius >= canvas.height) {
    //velocity has to be negative value because it is going upward
    ball.velocity.y *= -1;
  }
  //if the ball touches the top, bounces bounces back
  if (ball.pos.y + ball.radius <= marginTop) {
    ball.velocity.y *= -1;
  }
  //if the x coordinate of the bottom of the ball (the centerX + radius) touches the right wall, the ball bounces to the other direction
  if (ball.pos.x + ball.radius >= canvas.width) {
    ball.velocity.x *= -1;
  }
  //if the ball touches the left wall, the ball bounces to the orhter direction.
  if (ball.pos.x + ball.radius <= 0) {
    ball.velocity.x *= -1;
  }
}

//function to handle the paddle movement range
function paddleCollision(paddle) {
  //if the paddle touches the top, stay.
  if (paddle.pos.y <= marginTop) {
    paddle.pos.y = marginTop;
  }
  //if the paddle touches the bottom, stay.
  if (paddle.pos.y + paddle.height >= canvas.height) {
    paddle.pos.y = canvas.height - paddle.height;
  }
};



//function to create a ping-pong paddle
function Paddle(pos, velocity, width, height) {
  this.pos = pos;
  this.velocity = velocity;
  this.width = width;
  this.height = height;

  //method to move the ping pong paddle up and down
  this.update = function () {
    //when key up, move upward
    if (keyPressed[KeyUp]) {
      this.pos.y -= this.velocity.y;
    }
    //when key down, move down
    if (keyPressed[KeyDown]) {
      this.pos.y += this.velocity.y;
    }
  };

  //draw method to create a rectangle(paddle) that takes x-center, y-center, width, and height)
  this.draw = function () {
    ctx.fillStyle = "#33ff00";
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  };
  //method to get half width of the paddle
  this.getHalfWidth = function () {
    return this.width / 2;
  };
  //method to get half height of the paddle
  this.getHalfHeight = function () {
    return this.height / 2;
  };
  //method to get the center of the paddle
  this.getCenter = function () {
    return vec2(
      this.pos.x + this.getHalfWidth(),
      this.pos.y + this.getHalfHeight()
    );
  };
}

//Ball class to create a ball that takes x and y coordinate position, velocity, and radius
function Ball(pos, velocity, radius) {
  this.pos = pos;
  this.velocity = velocity;
  this.radius = radius;

  //update method to update the ball's position
  this.update = function () {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
  };

  //draw method to draw a ball
  this.draw = function () {
    //begin drawing the circle
    ctx.beginPath();
    //create a circle positioned at (centerX, centerY, radius, 0 , PI * 2, false: acr will be drawn in a clockwide direction )
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    //fill out the circle
    ctx.fill();
    //draw the outline.
    ctx.stroke();
  };
}

//function to implement a ball bouncing when it touches the paddle
function ballPaddleCollision(ball, paddle) {
  let dx = Math.abs(ball.pos.x - paddle.getCenter().x);
  let dy = Math.abs(ball.pos.y - paddle.getCenter().y);

  if (
    dx <= ball.radius + paddle.getHalfWidth() &&
    dy <= paddle.getHalfHeight() + ball.radius
  ) {
    ball.velocity.x *= -1;
  }
}

//create a ball
const ball = new Ball(vec2(150, 300), vec2(2, 2), 10);
//create paddles on each sides
const paddleLeft = new Paddle(vec2(0, 50), vec2(5, 5), 20, 100);
//x-center should be width - 20 because it occupies 20 width of the canvas
const paddleRight = new Paddle(
  vec2(canvas.width - 20, 50),
  vec2(5, 5),
  20,
  100
);

//function to update the ball and paddles position
function gameUpdate() {
  ball.update();
  paddleLeft.update();
  paddleCollision(paddleLeft);
  //paddleRight.update();
  ballCollision(ball);
  ballPaddleCollision(ball, paddleLeft);
  player2AI(ball,paddleRight);
  ballPaddleCollision(ball,paddleRight);
}

//dynamically update the ball and paddle's position by updating its position
function gameDraw() {
  ball.draw();
  paddleLeft.draw();
  paddleRight.draw();
}

//functino to create a player 2 (AI)
function player2AI(ball, paddle) {
  //if the ball is moving to the rightside
  if (ball.velocity.x > 0) {
    //and the ball is below the paddle
    if (ball.pos.y > paddle.pos.y) {
      //move the paddle downside
      paddle.pos.y += paddle.velocity.y;
      //make sure the paddle doesn't pass the canvas 
      if (paddle.pos.y + paddle.height >= canvas.height) {
        paddle.pos.y = canvas.height - paddle.height;
      }
    }
    //if the ball is above the paddle
    if (ball.pos.y < paddle.pos.y) {
      //move the paddle upward
      paddle.pos.y -= paddle.velocity.y;
      //make sure the paddle doesn't go above the canvas
      if (paddle.pos.y <= marginTop) {
        paddleLeft.pos.y = marginTop;
      }
    }
  }
}

//function to update the ball's position to implement the animation loop
function gameLoop() {
  //clear out the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //gameloop is called 60times/s
  window.requestAnimationFrame(gameLoop);

  gameUpdate();
  gameDraw();
}
gameLoop();
