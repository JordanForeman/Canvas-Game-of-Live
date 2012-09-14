/*
Title: Conway's Game of Life
Author: Jordan Foreman
Description: A simple implementation of Conway's Game of Life using javascript and the HTML5 Canvas
*/

//Globals
var cells = new Array(); //array containing all of the cells, both living and dead. Simple 1D array.
var canvas;
var context;
var zoom; //determines the size of the cells being displayed. High number, bigger cells. Must be >0
var population; //the base population percentage (inverse), so as this var increases, initial population decreases
var days = 0; //this is how many days (seconds) the population has been living. Increments on update
var fps = 2; //frames per second

//Init "game" logic
function main(){
	
	//Establish default global variables
	zoom = .5;
	population = 99;
	
	//Establish Canvas and Context
	canvas = document.getElementById('screen');
	if(canvas.getContext){
		context = canvas.getContext('2d');
	} else {
		alert('Error Retrieving Canvas Context');
	}
	
	//Randomly Generate Cells
	for(var i = 0; i < 100 / zoom; i++){
		cells[i] = new Array();
		for(var j = 0; j < 100 / zoom; j++){
			var cell = new Cell(i, j);
			if(Math.random() * 100 > population){
				cell.isAlive = true;
				cell.nextState = true;
			}
			cells[i].push(cell);
		}
	}
	
	/*context.strokeStyle = '#000000';
	for(var i = 1; i < 100 / zoom; i++){
		//Draw grid rows and cols
		
		var space  = 5 * zoom;
		
		context.beginPath();
		context.moveTo(0, i * space);
		context.lineTo(600, i * space);
		context.lineWidth = 1;
		context.stroke();
		context.closePath();
		
		context.beginPath();
		context.moveTo(i * space, 0);
		context.lineTo(i * space, 600);
		context.lineWidth = 1;
		context.stroke();
		context.closePath();
	} */
	
	//Set cells to update every second
	//console.log(cells);
	update();
	window.setTimeout(update, 1000/fps);
	
}

//Loops through all cells and draws only the living
function drawLivingCells(){
	//Draw living cells
	for(var i = 0; i < cells.length; i++){
		for(var j = 0; j < cells[i].length; j++){
			if(cells[i][j].isAlive){
				drawCell(cells[i][j]);
			} else {
				removeCell(cells[i][j]);
			}
		}
	}
}

//Draws a cell that is passed as a param
function drawCell(cell){
	context.fillStyle = '#000000';
	var space = 5 * zoom;
	var x = cell.position['x'] * space;
	var y = cell.position['y'] * space;
	context.fillRect(x, y, space, space);
}

//Removes a cell from the board
//TODO: fix this so that it only paints white over the cell, and not the grid lines...this is still a bit of a process.
function removeCell(cell){
	context.fillStyle = '#FFFFFF';
	var space = 5 * zoom;
	var x = cell.position['x'] * space;
	var y = cell.position['y'] * space;
	context.fillRect(x, y, space, space);
}

function checkCell(i, j){
	var count = 0;
	
	//Check cell on left
	if(j != 0){
		if(cells[i][j - 1].isAlive){
			count++
		}
	}
	
	//Check cell on right
	if(j < cells.length - 1){
		if(cells[i][j + 1].isAlive){
			count++
		}
	}
	
	//Check cell above
	if(i != 0){
		if(cells[i - 1][j].isAlive){
			count++
		}
	}
	
	//Check cell below
	if(i < cells.length - 1){
		if(cells[i + 1][j].isAlive){
			count++
		}
	}
	
	//Check cell top-left
	if(i != 0 && j != 0){
		if(cells[i - 1][j - 1].isAlive){
			count++
		}
	}
	
	//Check cell top-right
	if(i != 0 && j < cells.length - 1){
		if(cells[i - 1][j + 1].isAlive){
			count++
		}
	}
	
	//Check cell bottom-left
	if(i < cells.length - 1 && j != 0){
		if(cells[i + 1][j - 1].isAlive){
			count++
		}
	}
	
	//Check cell bottom-right
	if(i < cells.length - 1 && j < cells.length - 1){
		if(cells[i + 1][j + 1]){
			count++
		}
	}	
				
	//Return proper value
	if(cells[i][j].isAlive && count < 2){
		return false;
	}
	if(cells[i][j].isAlive && (count == 2 || count == 3)){
		return true;
	}
	if(cells[i][j].isAlive && count > 3){
		return false;
	}
	if(!cells[i][j].isAlive && count == 3){
		return true;
	}
	return false;
	
}

//Called once per second to update the logic
function update(){
	document.getElementById('iteration').innerHTML = days;
	days += 1;
	
	for(var i = 0; i < cells.length; i++){
		for(var j = 0; j < cells[i].length; j++){
			if(checkCell(i, j)){
				cells[i][j].nextState = true;
			} else {
				cells[i][j].nextState = false;
			}
		}
	}
	
	drawLivingCells();
	
	for(var i = 0; i < cells.length; i++){
		for(var j = 0; j < cells[i].length; j++){
			cells[i][j].isAlive = cells[i][j].nextState;
		}
	}
	
	window.setTimeout(update, 1000/fps);
}

//The Cell class
function Cell(x, y, ctx) {
	this.position = {
		'x' : x,
		'y' : y
	};
	this.isAlive = false;
	this.nextState = false;
}