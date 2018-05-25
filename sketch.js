let nn;

let possibilities = [
	{input: [0, 0], output:[0]},
	{input: [0, 1], output:[1]},
	{input: [1, 0], output:[1]},
	{input: [0, 1], output:[0]},
];

function setup() {
	createCanvas(100, 100);
	nn = new NeuralNetwork(2, [2], 1);
	noLoop();
}

function draw() {
	let map = [false, true];

	for (let i = 0; i < 500; i++) {		
		let choice = random(possibilities);
		nn.train(choice.input, choice.output);
		//console.log(nn.layers[2].incomingWeights.data.toString());
	}

	let choice = random(possibilities);
	let guess = nn.predict(choice.input);
	let correctGuess = Math.abs(guess[0] - choice.output[0]) < 0.5;

	fill(!correctGuess ? 255:0, correctGuess ? 255:0, 0);
	rect(0, 0, width, height);
	console.log(nn.layers[nn.Nblayers-1].error.data[0]);
}