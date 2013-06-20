var WIDTH = 640, HEIGHT = 480;

var canvas = jQuery("#gameCanvas")[0];
var context = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;

var DEFAULT_SIZE = 20.0, DEFAULT_SPEED = 1/10;

//
var snake_array;
var size_snake;
var DIRECTIONS = {LEFT: "left", RIGHT: "right", UP: "up", DOWN: "down"};
var FOOD_TYPE = ["normal", "half", "faster", "slower", "colorchange", "virus_keyboard"];
var direction;
var food;
var score;

//
var current_time, timer;
var speed_game;

//
var invert_keyboard;

//
var DEFAULKT_BG_COLOR = "#000000";
var DEFAULT_SNAKE_COLOR = "#64FE2E"

var bgcolor;
var snake_color;

// Request Animation Frame
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function FoodModel(x, y, type)
{
	this.x = x;
	this.y = y;
	this.type = type;
}

function restore()
{
	bgcolor = DEFAULKT_BG_COLOR;
	snake_color = DEFAULT_SNAKE_COLOR;

	size_snake = DEFAULT_SIZE;
	speed_game = DEFAULT_SPEED;

	invert_keyboard = false;
}

function init()
{
	timer = 0;
	score = 0;
	size_snake = DEFAULT_SIZE;
	direction = DIRECTIONS.RIGHT;
	createSnake();
	createFood();
	speed_game = DEFAULT_SPEED;
	bgcolor = DEFAULKT_BG_COLOR;
	snake_color = DEFAULT_SNAKE_COLOR;
	invert_keyboard = false;
}

function createFood()
{
	var x = Math.round(Math.random() * (WIDTH - size_snake) / size_snake);
	var y = Math.round(Math.random() * (HEIGHT - size_snake) / size_snake);
	var type = FOOD_TYPE[Math.round(Math.random() * FOOD_TYPE.length)];
	food = new FoodModel(x, y, type);
}

function createSnake()
{
	var length = 5;
	snake_array = [];
	for(var i = length -1 ; i >= 0; i--)
	{
		snake_array.push({x:parseFloat(i), y:0.0});
	}
}

function checkCollision(x, y, array)
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

function thread()
{
    var now = new Date().getTime(), dt = 1 / (now - (current_time || now));
    current_time = now;

	draw();
	timer += dt;
	if(timer >= speed_game)
	{
		update(0);
		timer = 0;
	}
	requestAnimFrame(thread);
}

function draw()
{
	context.fillStyle = bgcolor;
	context.fillRect(0, 0, WIDTH, HEIGHT);

	// 

	for(var i = 0; i < snake_array.length; i++)
	{
		var posX = parseFloat(snake_array[i].x);
		var posY = parseFloat(snake_array[i].y);

		context.fillStyle = snake_color;
		context.fillRect(posX * size_snake, posY * size_snake, size_snake, size_snake);

		context.fillStyle = "#FF0000";
		context.strokeRect(posX * size_snake, posY * size_snake, size_snake, size_snake);
	}

	// Draw food

	switch(food.type)
	{
		case FOOD_TYPE[0]:
			context.fillStyle = "#FF0000";
		break;

		case FOOD_TYPE[1]:
			context.fillStyle = "#0000FF";
		break;

		case FOOD_TYPE[2]:
			context.fillStyle = "#FF00FF";
		break;

		case FOOD_TYPE[3]:
			context.fillStyle = "#00CCCC";
		break;

		case FOOD_TYPE[4]:
			context.fillStyle = "#B404AE";
		break;

		case FOOD_TYPE[5]:
			context.fillStyle = "#FFFFFF";
		break;

	}

	context.fillRect(food.x * size_snake, food.y * size_snake, size_snake, size_snake);

	// Draw score
	context.fillStyle = "#FFFFFF";
	context.font="20px Georgia";
	context.fillText("Score: " + score, 20, HEIGHT - 20);

}

function update(dt)
{
	var headX = snake_array[0].x, headY = snake_array[0].y;

	switch(direction)
	{
		case DIRECTIONS.LEFT:
			headX--;
		break;

		case DIRECTIONS.RIGHT:
			headX++;
		break;

		case DIRECTIONS.UP:
			headY--;
		break;

		case DIRECTIONS.DOWN:
			headY++;
		break;
	}


	if(headX * size_snake >= WIDTH)
		headX = 0;

	if(headY * size_snake >= HEIGHT)
		headY = 0;

	if(headX <= -1)
		headX = WIDTH / size_snake;

	if(headY <= -1)
		headY = HEIGHT / size_snake;

	if(checkCollision(headX, headY, snake_array))
	{
		init();
		return;
	}
		

	if(headX == food.x && headY == food.y)
	{
		var tail = {x: headX, y: headY};		
		score++;

		restore();

		switch(food.type)
		{
			case FOOD_TYPE[1]:
				size_snake = size_snake * 0.5;
			break;
			case FOOD_TYPE[2]:
				speed_game = 1 / 24;
			break;
			case FOOD_TYPE[3]:
				speed_game = 0.5;
			break;
			case FOOD_TYPE[4]:
				bgcolor = DEFAULT_SNAKE_COLOR;
				snake_color = DEFAULKT_BG_COLOR;
			break;
			case FOOD_TYPE[5]:
				invert_keyboard = true;
			break;			
		}
		
		createFood();
	}
	else
	{
		var tail = snake_array.pop();
		tail.x = headX;
		tail.y = headY;		
	}

	snake_array.unshift(tail);

}

jQuery(document).keydown(function(e)
{
	var key = e.which;
	if(!invert_keyboard)
	{
		if(key == "37" && direction != DIRECTIONS.RIGHT)
			direction = DIRECTIONS.LEFT;
		else if(key == "38" && direction != DIRECTIONS.DOWN)
			direction = DIRECTIONS.UP;
		else if(key == "39" && direction != DIRECTIONS.LEFT)
			direction = DIRECTIONS.RIGHT;
		else if(key == "40" && direction != DIRECTIONS.UP)
			direction = DIRECTIONS.DOWN;
	}
	else
	{
		if(key == "37" && direction != DIRECTIONS.LEFT)
			direction = DIRECTIONS.RIGHT;
		else if(key == "38" && direction != DIRECTIONS.UP)
			direction = DIRECTIONS.DOWN;
		else if(key == "39" && direction != DIRECTIONS.RIGHT)
			direction = DIRECTIONS.LEFT;
		else if(key == "40" && direction != DIRECTIONS.DOWN)
			direction = DIRECTIONS.UP;
	}

});

//
init();
requestAnimFrame(thread);