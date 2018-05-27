class ActivationFunction{
    constructor(func, derivative) {
        this.func = func;
        this.dfunc = derivative;
    }
}

const sigmoid = new ActivationFunction((val) => 1/(1+exp(-val)), (val)  => val*(1-val));
const ReLU = new ActivationFunction((val, x, y) => Math.max(0,val), (val, x, y)  => (val >= 0) ? 1 : 0);
const tanh = new ActivationFunction((val, x, y) => Math.tanh(val), (val, x, y)  => 1 - (val*val));

class NeuralNetwork {
    constructor(inputLayer, hiddenLayers, outputLayer, activation = sigmoid) {
        // this.layers: the total number of layers in this NN
        //                  there are hiddenLayers.length hidden layer, one input and one output layer
        this.Nblayers = hiddenLayers.length + 2;

        // this.nodesPerLayer: an array were the value at the n-th index indicates the number of nodes 
        //                      in the n-th layer.
        let nodesPerLayer = [inputLayer];
        nodesPerLayer = nodesPerLayer.concat(hiddenLayers);
        nodesPerLayer.push(outputLayer);

        this.layers = []; 
        for (let i = 0; i < this.Nblayers; i++) {
            this.layers.push({
                nodes: nodesPerLayer[i],
                bias: i == 0 ? new Tensor(nodesPerLayer[i], 1) : new Tensor(nodesPerLayer[i], 1).randomize(),
                error: new Tensor(nodesPerLayer[i], 1),
                value: new Tensor(nodesPerLayer[i], 1),
                incomingWeights: i == 0 ? null : new Tensor(nodesPerLayer[i], nodesPerLayer[i-1]).randomize()
            });
        }

        this.activationFunction = activation;
        this.learningRate = 0.1;
    }

    /**
     * Runs the given input through the NN and compares the output with the given expected value.
     * Based on the difference, the NN will be adjusted using backpropegation.
     * @param {Number array} input Array with the inputs (Array of numbers)
     * @param {Number array} expected Array of the expected output given the input
     */
    train(input, expected) {
        if (input.length != this.layers[0].nodes || expected.length != this.layers[this.Nblayers-1].nodes)
            throw new Error("Input or expected output does not match the number of input/output nodes.");

        // Set this.layers.value for each layer with the given input
        this.predict(input);
   
        // Calculate the error for the output layer
        this.layers[this.Nblayers-1].error = Tensor.sub(Tensor.fromArray(expected), this.layers[this.Nblayers-1].value);

        // Starting to from the output layer, we work back to the first hidden layer
        // For each layer, we calculate the layer error and tweak the weights and bias accordingly.
        for (let i = this.Nblayers-2; i >= 0; i--) {
            // Calculate the error
            this.layers[i].error = Tensor.cross(Tensor.transpose(this.layers[i+1].incomingWeights), this.layers[i+1].error);

            let gradients = Tensor.map(this.layers[i+1].value, this.activationFunction.dfunc)
            .mul(this.layers[i+1].error)
            .mul(this.learningRate);

            let deltas = Tensor.cross(
                gradients,
                Tensor.transpose(this.layers[i].value)
            );

            this.layers[i+1].incomingWeights.add(deltas);
            this.layers[i+1].bias.add(gradients);
        }
    }

    predict(inputs) {
        if (inputs.length != this.layers[0].nodes) throw new Error("Input data does not match input nodes");

        let values = Tensor.fromArray(inputs);
        this.layers[0].value = values.copy();

        for (let i = 0; i < this.Nblayers-1; i++) {            
            values =
             Tensor.cross(this.layers[i+1].incomingWeights, this.layers[i].value)
             .add(this.layers[i+1].bias)
             .map(this.activationFunction.func);
            this.layers[i+1].value = values.copy();     
        }

        return Tensor.tensorToArray(values);
    }

    setLearningRate(rate) {
        this.learningRate = rate;
    }
}

if (typeof module !== 'undefined') {
    module.exports = NeuralNetwork;
}