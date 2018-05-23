const Tensor = require('./tensor.js');

test('Test name', () => {
	let tensor = new Tensor(2, 3);
	tensor = Tensor.add(tensor, 5);
	let expected = [[5, 5, 5], [5, 5, 5]];
	expect(tensor.data).toEqual(expected);
});