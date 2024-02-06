//create a 2D canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ctx.fillStyle = "#ff0000";
// //fill out the rectangle with a (x-coord, y-coord, width, height)
// ctx.fillRect(30, 10, 10, 10);

ctx.fillStyle = "#ff00ff";
ctx.strokeStyle = "#ff00ff";

let ballx = 50;
let bally = 40;
let ballRadius = 10;
function gameUpdate() {}

function gameDraw() {}

//function to update the ball's position to implement ball-animation
function gameLoop() {

  //clear out the canvas 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(gameLoop);
  ballx += 1;
  bally += 1;

  //begin drawing the circle
  ctx.beginPath();
  //create a circle positioned at (centerX, centerY, radius, 0 , PI * 2, false: acr will be drawn in a clockwide direction )
  ctx.arc(ballx, bally, ballRadius, 0, Math.PI * 2, false);
  //fill out the circle
  ctx.fill();
  //draw the outline.
  ctx.stroke();


  gameUpdate();
  gameDraw();
}
gameLoop();
