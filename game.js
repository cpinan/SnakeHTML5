var WIDTH = 640, HEIGHT = 480;

var canvas = jQuery("#gameCanvas")[0];
var context = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;

var snake_array;
var cw = 10;
var direction;
var food;
var score;


var time, timer = 0;

// Request Animation Frame
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function init()
{
	direction = "right";
	createSnake();
	createFood();
	score = 0;
}


//
function thread()
{

    var now = new Date().getTime(), dt = 1 / (now - (time || now));
    time = now;

	timer += dt;

	if(timer >= 1/10)
	{
		draw();
		update(dt);		
		timer = 0;
	}
	requestAnimFrame(thread);

}

//
function draw()
{
	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, WIDTH, HEIGHT);

	context.strokeStyle = "#000000";
	context.strokeRect(0, 0, WIDTH, HEIGHT);
}

//
function paintCell(x,y)
{
	context.fillStyle = "blue";
	context.fillRect(x*cw, y*cw, cw, cw);
	context.strokeStyle = "white";
	context.strokeRect(x*cw, y*cw, cw, cw);
}

// 
function checkCollision(x,y,array)
{
	for(var i = 0; i < array.length; i++)
	{
		if(array[i].x == x && array[i].y == y)
		{
			return true;
		}
	}
	return false;
}

//
function update(dt)
{
	var headX = snake_array[0].x;
	var headY = snake_array[0].y;

	if(direction == "right")
		headX++;

	if(direction == "left")
		headX--;

	if(direction == "up")
		headY--;

	if(direction == "down")
		headY++;

	if(headX == -1 || headX == WIDTH / cw || headY == -1 || headY == HEIGHT / cw || checkCollision(headX, headY, snake_array))
	{
		init();
		return;
	}

	if(headX == food.x && headY == food.y)
	{
		var tail = {x: headX, y: headY};
		score++;
		createFood();
	}
	else
	{
		var tail = snake_array.pop();
		tail.x = headX;
		tail.y = headY;
	}

	snake_array.unshift(tail);

	for(var i = 0; i < snake_array.length; i++)
	{
		var c = snake_array[i];
		paintCell(c.x, c.y);
	}

	paintCell(food.x, food.y);
	var score_text = "Score: " + score;
	context.fillText(score_text, 5, HEIGHT - 5);
}

//
function createSnake()
{
	var length = 25;
	snake_array = [];
	for(var i = length - 1; i >= 0; i--)
	{
		snake_array.push({x: i, y: 0});
	}
}

//
function createFood()
{
	food = {
		x: Math.round(Math.random() * (WIDTH - cw) / cw),
		y: Math.round(Math.random() * (HEIGHT - cw) / cw)
	};
}

//

jQuery(document).keydown(function(e)
{
	var key = e.which;
	if(key == "37" && direction != "right")
		direction = "left";
	else if(key == "38" && direction != "down")
		direction = "up";
	else if(key == "39" && direction != "left")
		direction = "right";
	else if(key == "40" && direction != "up")
		direction = "down";
});

init();
requestAnimFrame(thread);