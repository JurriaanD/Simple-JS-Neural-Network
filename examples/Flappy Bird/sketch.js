"use strict";
let game;
let assets;
const nbBirds = 50;
let ticks = 1;
let trainingmode = true;

function preload() {
	assets = [];
	assets["bird"] = loadImage("assets/bird.png");
	assets["pipeUp"] = loadImage("assets/pipe_up.png");
	assets["pipeDown"] = loadImage("assets/pipe_down.png");
}

function setup () {
	createCanvas(window.innerWidth,window.innerHeight);
	game = new Game(nbBirds);
}

function draw () {	
	game.draw();
	if (trainingmode) {
		let failsafe = 0;
		while(!game.isGameOver() && failsafe++ < 100000) {
			game.tick();
		}
		game.privateBirdTime();	
	} else {
		for (let i = 0; i < ticks; i++) {
			game.tick();
			if (game.isGameOver()) {
				game.privateBirdTime();
			}
		}
	}			
}

function keyPressed() {
	switch (keyCode) {
		case UP_ARROW:
			ticks *= 1.5;
			break;
		case DOWN_ARROW:
			ticks = Math.max(1, ticks / 1.5);
			break;
		case 32:
			trainingmode = !trainingmode;
			break;
		case ENTER:
			noLoop();
			break;
	}
}

/**
 * A small extension the the neural network class to allow neuro-evolution.
 * Only the weights and biases can change in this function.
 * @param {Number} mutationRate: A number between 0 and 1 that determines the change of a mutation occuring. 
 */
NeuralNetwork.prototype.mutate = function(mutationRate) {
	for (let i = 1; i < this.layers.length; i++) {
		if (Math.random() < mutationRate) {
			this.layers[i].incomingWeights.map((val, x, y) => val + randomGaussian() * 0.5);
			this.layers[i].bias.map((val, x, y) => val + randomGaussian() * 0.5);
		}
	}
}