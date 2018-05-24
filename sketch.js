let nn;

function setup() {
	createCanvas(100, 100);
	nn = new NeuralNetwork(2, [2], 1);
	//noLoop();
}

function draw() {
	let map = [false, true];

	for (let i = 0; i < 10; i++) {		
		let a = Math.round(Math.random());
		let b = Math.round(Math.random());
		let expected = (map[a] || map[b]) && !(map[a] && map[b]);
		let inp = [a, b];
		let out = [expected?1:0];
		nn.train(inp, out);
		console.log(nn.layers[2].incomingWeights.data.toString());

		let guess = nn.predict(inp);
		let correctGuess = guess[0] == out[0];

		fill(!correctGuess ? 255:0, correctGuess ? 255:0, 0);
		rect(0, 0, width, height);
	}
}