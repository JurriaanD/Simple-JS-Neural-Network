class ActivationFunction{
    constructor(func, derivative) {
        this.f = func;
        this.d = derivative;
    }
}

const sigmoid = new ActivationFunction((val, x, y) => 1/(1+exp(-1*val)), (val, x, y)  => val*(1-val));
const ReLU = new ActivationFunction((val, x, y) => Math.max(0,val), (val, x, y)  => (val >= 0) ? 1 : 0);
const tanh = new ActivationFunction((val, x, y) => Math.tanh(val), (val, x, y)  => 1 - (val*val));