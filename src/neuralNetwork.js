class NeuralNetwork {
    constructor(inputLayer, hiddenLayers, outputLayer, activation = ReLU) {
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
                bias: new Tensor(nodesPerLayer[i], 1).randomize(),
                error: new Tensor(nodesPerLayer[i], 1),
                value: new Tensor(nodesPerLayer[i], 1),
                incomingWeights: i == 0 ? null : new Tensor(nodesPerLayer[i], nodesPerLayer[i-1])
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
        // Set the values for each layer
        this.predict(input);
   
        for (let i = this.Nblayers-1; i > 0; i--) {
            // Calculate the error
            this.layers[i].error = i == this.Nblayers-1
                ? Tensor.sub(Tensor.fromArray(expected), this.layers[i].value)
                : Tensor.cross(Tensor.transpose(this.layers[i+1].incomingWeights), this.layers[i+1].error);
            let gradients = 
                Tensor.map(this.layers[i].value, this.activationFunction.d)
                .mul(this.layers[i].error)
                .mul(this.learningRate);

            let deltas = Tensor.cross(gradients, Tensor.transpose(this.layers[i-1].value));

            this.layers[i].incomingWeights.add(deltas);
            this.layers[i].bias.add(gradients);
        }
    }

    predict(inputs) {
        if (inputs.length != this.layers[0].nodes) throw new Error("Input data does not match input nodes");

        let values = Tensor.fromArray(inputs);
        this.layers[0].value = values.copy();

        for (let i = 1; i < this.Nblayers; i++) {            
            values =
             Tensor.cross(this.layers[i].incomingWeights, this.layers[i-1].value)
             .add(this.layers[i].bias)
             .map(this.activationFunction.f);
            this.layers[i].value = values.copy();     
        }

        return Tensor.tensorToArray(values);
    }
}