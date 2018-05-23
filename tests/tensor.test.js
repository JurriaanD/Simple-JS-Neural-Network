import test from 'ava';
import Tensor from 'tensor';

test('tensorMatrixAddNumber', t => {
	let tensor = new Tensor(2, 3).add(5);
	let expected = [[5, 5, 5], [5, 5, 5]];
	t.deepEqual(tensor.data, expected);
});

test('bar', async t => {
	const bar = Promise.resolve('bar');

	t.is(await bar, 'bar');
});