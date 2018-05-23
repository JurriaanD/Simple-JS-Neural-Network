class NeuralNetwork {
    constructor(inputLayer, hiddenLayers, outputLayer, activation = ReLU) {
        // this.NbInputs = number of nodes in the input layer
        this.NbInputs = inputLayer;
        // this.NbHiddenLayers = number of hidden layers
        // this.nodesPerHiddenLayer = array with the n-th element the number of nodes in the n-th hidden layer
        // this.weights: extract the value from the previous layer and multiply by the value in the tensor
        // hiddenBias = array with the n-th Tensor the bias for the n-th hidden layer
        this.NbHiddenLayers = hiddenLayers.length;
        this.nodesPerHiddenLayer = hiddenLayers;

        // Initialize all the weights
        this.weights = new Array(this.NbHiddenLayers + 1);
        this.weights[0] = new Tensor(this.nodesPerHiddenLayer[0], this.NbInputs).randomize();
        for (let i = 1; i < this.NbHiddenLayers; i++) {
            this.weights[i] = new Tensor(this.nodesPerHiddenLayer[i], this.hiddenLayerWeights[i-1]).randomize();
        }
        this.weights[this.NbHiddenLayers] = new Tensor(outputLayer, this.nodesPerHiddenLayer[this.NbHiddenLayers-1]);

        this.hiddenBias = new Array(this.NbHiddenLayers);
        for (let i = 0; i < this.NbHiddenLayers; i++) {
            this.hiddenBias[i] = new Tensor(this.nodesPerHiddenLayer[i], 1).randomize();
        }
        // this.NbOutputs = number of nodes in the output layer
        this.NbOutputs = outputLayer;

        // this.memory = This variable stores the weight of each node after predicting/feeding forward.
        this.memory = new Array(this.NbHiddenLayers + 2);
        this.memory[0] = new Tensor(this.NbInputs, 1);
        for (let i = 1; i < this.NbHiddenLayers+1; i++) {
            this.memory[i] = new Tensor(this.nodesPerHiddenLayer[i-1], 1);
        }
        this.memory[this.NbHiddenLayers+1] = new Tensor(this.NbOutputs, 1);

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
        let inputs = Tensor.from1DArray(input);
        let outputs = Tensor.from1DArray(this.predict(input));
        expected = Tensor.from1DArray(expected);

        // Calculate the error on the output nodes
        let layerError = Tensor.sub(expected, outputs);
        
        for (let i = this.NbHiddenLayers; i >= 0; i--) {
            let transposedNodes = Tensor.transpose(this.memory[i]);
            let deltaWeight = Tensor.map(layerError, this.activationFunction.d);
            deltaWeight = Tensor.mul(deltaWeight, this.learningRate);
            //transposedNodes.print();
            //deltaWeight.print();
            deltaWeight = Tensor.mul(deltaWeight, transposedNodes);


            this.weights[i] = Tensor.add(deltaWeight);

            layerError = Matrix.mul(transposedNodes, layerError);
        }
    }

    predict(inputs) {
        if (inputs.length != this.NbInputs) throw new Error("Input data does not match input nodes");

        let values = Tensor.from1DArray(inputs);
        for (let i = 0; i < this.NbHiddenLayers; i++) {
            this.memory[i] = values.copy();
            values = Tensor.mul(this.weights[i], values);
            values = Tensor.add(values, this.hiddenBias[i]);
            values.map(this.activationFunction.f);
            console.table(this.memory[i]);
        }
        
        return Tensor.tensor1DToArray(values);
    }
}