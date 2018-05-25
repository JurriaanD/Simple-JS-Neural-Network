const Tensor = require('./tensor.js');

test('Matrix map (instance)', () => {
	let tensor = Tensor.fromArray([
		[1, 2, 3], 
		[4, 5, 6],
		[7, 8, 9]
	]);
	
	let expected = [
		[2, 4, 6], 
		[8, 10, 12],
		[14, 16, 18]
	];

	tensor.map((val, x, y) => 2*val);
	expect(tensor.data).toEqual(expected);
});

test('Matrix map (static)', () => {
	let tensor = Tensor.fromArray([
		[1, 2, 3], 
		[4, 5, 6],
		[7, 8, 9]
	]);

	let expected = [
		[2, 4, 6], 
		[8, 10, 12],
		[14, 16, 18]
	];

	result = Tensor.map(tensor, (val, x, y) => 2*val);
	expect(result.data).toEqual(expected);
});

test('Matrix mul Matrix (instance)', () => {
	let tensor1 = Tensor.fromArray([
		[1, 2, 3], 
		[4, 5, 6],
		[7, 8, 9]
	]);
	let tensor2 = Tensor.fromArray([
		[1, 2, 1], 
		[3, 1, 1],
		[4, 2, 1]
	]);
	let expected = [
		[1, 4, 3],
		[12, 5, 6],
		[28, 16, 9]
	];
	tensor1.mul(tensor2);
	expect(tensor1.data).toEqual(expected);
});

test('Matrix mul Matrix (static)', () => {
	let tensor1 = Tensor.fromArray([
		[1, 2, 3], 
		[4, 5, 6],
		[7, 8, 9]
	]);
	let tensor2 = Tensor.fromArray([
		[1, 2, 1], 
		[3, 1, 1],
		[4, 2, 1]
	]);
	let expected = [
		[1, 4, 3],
		[12, 5, 6],
		[28, 16, 9]
	];
	let result = Tensor.mul(tensor1, tensor2);
	expect(result.data).toEqual(expected);
});

test('Matrix mul Scalar (instance)', () => {
	let tensor = Tensor.fromArray([
		[1, 2, 3], 
		[4, 5, 6],
		[7, 8, 9]
	]);

	let expected = [
		[3, 6, 9],
		[12, 15, 18],
		[21, 24, 27]
	];
	tensor.mul(3);
	expect(tensor.data).toEqual(expected);
});

test('Matrix mul Scalar (static)', () => {
	let tensor = Tensor.fromArray([
		[1, 2, 3], 
		[4, 5, 6],
		[7, 8, 9]
	]);

	let expected = [
		[3, 6, 9],
		[12, 15, 18],
		[21, 24, 27]
	];
	let result = Tensor.mul(tensor, 3);
	expect(result.data).toEqual(expected);
});

test('Matrix add Scalar (instance)', () => {
	let tensor = new Tensor(2, 3);
	tensor = tensor.add(5);
	let expected = [[5, 5, 5], [5, 5, 5]];
	expect(tensor.data).toEqual(expected);
});

test('Matrix add Scalar (static)', () => {
	let tensor = new Tensor(2, 3);
	let result = Tensor.add(tensor, 6);
	let expected = [[6, 6, 6], [6, 6, 6]];
	expect(result.data).toEqual(expected);
});

test('Matrix add matrix (instance)', () => {
	let tensor1 = Tensor.fromArray([
		[1, 2, 3],
		[4, 5, 6]
		]);

	let tensor2 = Tensor.fromArray([
		[5, 1, 3],
		[8, 7, 1]
	]);

	tensor1.add(tensor2);
	let expected = [[6, 3, 6], [12, 12, 7]];
	expect(tensor1.data).toEqual(expected);
});

test('Matrix add Matrix (static)', () => {
	let tensor1 = Tensor.fromArray([
		[1, 2, 3],
		[4, 5, 6]
	]);

	let tensor2 = Tensor.fromArray([
		[5, 1, 3],
		[8, 7, 1]
	]);

	let result = Tensor.add(tensor1, tensor2);
	let expected = [[6, 3, 6], [12, 12, 7]];
	expect(result.data).toEqual(expected);
});

test ('Matrix cross Matrix (static)', () => {
	let tensor1 = Tensor.fromArray([
		[5, 2, 4],
		[8, 4, 3]
	]);

	let tensor2 = Tensor.fromArray([
		[2, 5, 3, 7, 5],
		[5, 7, 5, 7, 2],
		[1, 8, 7, 6, 2]
	]);

	let result = Tensor.cross(tensor1, tensor2);
	let expected = [
		[24, 71, 53, 73, 37],
		[39, 92, 65, 102, 54]
	];
	expect(result.data).toEqual(expected);
});

test('Matrix sub Scalar (instance)', () => {
	let tensor = new Tensor(2, 3);
	tensor = tensor.sub(-5);
	let expected = [[5, 5, 5], [5, 5, 5]];
	expect(tensor.data).toEqual(expected);
});

test('Matrix sub Scalar (static)', () => {
	let tensor = new Tensor(2, 3);
	let result = Tensor.sub(tensor, -6);
	let expected = [[6, 6, 6], [6, 6, 6]];
	expect(result.data).toEqual(expected);
});

test('Matrix sub Matrix (instance)', () => {
	let tensor1 = Tensor.fromArray([
		[1, 2, 3],
		[4, 5, 6]
		]);

	let tensor2 = Tensor.fromArray([
		[5, 1, 3],
		[8, 7, 1]
	]);

	tensor1.sub(tensor2);
	let expected = [[-4, 1, 0], [-4, -2, 5]];
	expect(tensor1.data).toEqual(expected);
});

test('Matrix sub Matrix (static)', () => {
	let tensor1 = Tensor.fromArray([
		[1, 2, 3],
		[4, 5, 6]
	]);

	let tensor2 = Tensor.fromArray([
		[5, 1, 3],
		[8, 7, 1]
	]);

	let result = Tensor.sub(tensor1, tensor2);
	let expected = [[-4, 1, 0], [-4, -2, 5]];
	expect(result.data).toEqual(expected);
});

test ('Matrix transpose (static)', () => {
	let tensor = Tensor.fromArray([
		[5, 2, 4],
		[8, 4, 3]
	]);
	let result = Tensor.transpose(tensor);
	let expected = [[5, 8], [2, 4], [4, 3]];
	expect(result.data).toEqual(expected);
})

test('1D Array to Matrix', () => {
	let inp = [0.41, 0.78];
	let out = Tensor.fromArray(inp);
	let expected = [[0.41], [0.78]];
	expect(out.data).toEqual(expected);
});

test('Copy Matrix', () => {
	let tensor1 = Tensor.fromArray([
		[1, 2, 3], 
		[4, 5, 6],
		[7, 8, 9]
	]);
	let tensor2 = tensor1.copy();

	expect(tensor2.data).toEqual(tensor1.data);
});