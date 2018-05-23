let nn;

function setup() {
	createCanvas(100, 100);
	noLoop();
}

function draw() {
	nn = new NeuralNetwork(2, [2], 2);
	let map = [false, true];

	for (let i = 0; i < 1; i++) {		
		let a = Math.round(Math.random());
		let b = Math.round(Math.random());
		let expected = (map[a] || map[b]) && !(map[a] && map[b]);
		let inp = [a, b];
		let out = [expected?1:0, expected?0:1];
		nn.train(inp, out);
	}

	console.log(nn.memory);
}