const Tensor = require('./tensor.js');

test('Matrix add scalar', () => {
	let tensor = new Tensor(2, 3);
	tensor = Tensor.add(tensor, 5);
	let expected = [[5, 5, 5], [5, 5, 5]];
	expect(tensor.data).toEqual(expected);
});

test('Matrix add matrix', () => {
	let tensor1 = new Tensor(2, 3);
	tensor1.data = [[1, 2, 3], [4, 5, 6]];

	let tensor2 = new Tensor(2, 3);
	tensor2.data = [[5, 1, 3], [8, 7, 1]];

	let result = Tensor.add(tensor1, tensor2);

	let expected = [[6, 3, 6], [12, 12, 7]];

	expect(result.data).toEqual(expected);
});

test('Matrix multiply with scalar', () => {
	let tensor = new Tensor(2, 3);
	tensor.data = [[1, 2, 3], [4, 5, 6]];

	let result = Tensor.mul(tensor, 2);

	let expected = [[2, 4, 6], [8, 10, 12]];

	expect(result.data).toEqual(expected);
});

test ('Matrix mulitply with matrix', () => {
	let tensor1 = new Tensor(2, 3);
	tensor1.data = [[5, 2, 4], [8, 4, 3]];

	let tensor2 = new Tensor(3, 5);
	tensor2.data = [[2, 5, 3, 7, 5], [5, 7, 5, 7, 2], [1, 8, 7, 6, 2]];

	let result = Tensor.mul(tensor1, tensor2);

	let expected = [[24, 71, 53, 73, 37], [39, 92, 65, 102, 54]];

	expect(result.data).toEqual(expected);
});

test ('Transpose matrix', () => {
	let tensor = new Tensor(2, 3);
	tensor.data = [[5, 2, 4], [8, 4, 3]];
	let result = Tensor.transpose(tensor);

	let expected = [[5, 8], [2, 4], [4, 3]];

	expect(result.data).toEqual(expected);
})