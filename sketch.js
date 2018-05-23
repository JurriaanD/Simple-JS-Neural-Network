let nn;

function setup() {
	createCanvas(100, 100);
	nn = new NeuralNetwork(2, [2], 2);
	//noLoop();
}

function draw() {
	let map = [false, true];

	for (let i = 0; i < 1; i++) {		
		let a = Math.round(Math.random());
		let b = Math.round(Math.random());
		let expected = (map[a] || map[b]) && !(map[a] && map[b]);
		let inp = [a, b];
		let out = [expected?1:0, expected?0:1];
		nn.train(inp, out);
		console.log(nn.layers[2].incomingWeights.toString());
		/*let guess = nn.predict(inp);
		let correctGuess;

		if (out[0] == 1) {
			correctGuess = guess[0] > guess[1];
		} else {
			correctGuess = guess[0] < guess[1];
		}
		fill(!correctGuess ? 255:0, correctGuess ? 255:0, 0);
		rect(0, 0, width, height);*/
	}
}