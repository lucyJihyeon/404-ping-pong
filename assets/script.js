//create a 2D canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const marginTop = 150;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// ctx.fillStyle = "#ff0000";
// //fill out the rectangle with a (x-coord, y-coord, width, height)
// ctx.fillRect(30, 10, 10, 10);
ctx.fillStyle = "#ff00ff";
ctx.strokeStyle = "#ff00ff";


//converting the x coordinate and y coordinate as a properties in an object
function vec2(x, y) {
  return { x: x, y: y };
}

function ballCollosion(ball)    {
    //if the y coordinate of the bottom of the ball (the centerY + radius) touches the bottom side of the canvas, the ball moves upward
    if (ball.pos.y + ball.radius >= canvas.height)  {
        //velocity has to be negative value because it is going upward
        ball.velocity.y *= -1;
    }
    //if the ball touches the top, bounces bounces back 
    if (ball.pos.y + ball.radius <= marginTop)  {
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

const ball = new Ball(vec2(150, 300), vec2(2, 2), 10);

//function to update the ball position
function gameUpdate() {
  ball.update();
  ballCollosion(ball);
}

function gameDraw() {
  ball.draw();
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
