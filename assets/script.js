//create a 2D canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// ctx.fillStyle = "#ff0000";
// //fill out the rectangle with a (x-coord, y-coord, width, height)
// ctx.fillRect(30, 10, 10, 10);

ctx.fillStyle = "#ff00ff";
ctx.strokeStyle = "#ff00ff";

let ballx = 150;
let bally = 300;
let ballRadius = 10;
let ballVelX =2;
let ballVelY = 2;

//function to update the ball position
function gameUpdate() {
  ballx += ballVelX;
  bally += ballVelY;
}

function gameDraw() {
  //begin drawing the circle
  ctx.beginPath();
  //create a circle positioned at (centerX, centerY, radius, 0 , PI * 2, false: acr will be drawn in a clockwide direction )
  ctx.arc(ballx, bally, ballRadius, 0, Math.PI * 2, false);
  //fill out the circle
  ctx.fill();
  //draw the outline.
  ctx.stroke();
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
