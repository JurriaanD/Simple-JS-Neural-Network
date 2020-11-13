let nn;
let dataset;
let imageObject;
let trainingIndex = 0;
let fitnessChart;

function setup() {
    const canvas = createCanvas(200, 200);
    canvas.parent('sketch-holder');
    pixelDensity(1);
    imageObject = createImage(28, 28);
    loadMNIST(function (data) {
        dataset = data;
    });
    nn = new NeuralNetwork(784, [200, 80], 10);

    const ctx = document.getElementById('myChart').getContext('2d');
    fitnessChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3],
            datasets: [{
                    label: "Training error",
                    data: [],
                    borderColor: "#19aade",
                    fill: false
                },
                {
                    label: "Test error",
                    data: [],
                    borderColor: "#ef7e32",
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [{
                    display: false
                }]
            },
            elements: {
                line: {
                    tension: 0
                }
            }
        }
    });
}

function draw() {
    // False while the dataset is loading
    if (dataset) {
        updateUI();
        for (let i = 0; i < 5; i++) {
            train(false);
        }
    }
}

function train() {
    if (trainingIndex >= dataset.train_images.length) return;

    let nnInput = [];
    for (let i = 0; i < 28 * 28; i++) {
        let val = dataset.train_images[trainingIndex][i]
        nnInput[i] = val / 255;
    }

    let expectedOutput = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expectedOutput[dataset.train_labels[trainingIndex]] = 1;
    nn.train(nnInput, expectedOutput);

    trainingIndex++;
    if (trainingIndex >= dataset.train_images.length) {
        noLoop();
        console.log("Done training!");
    }
}

function updateUI() {
    imageObject.loadPixels();
    for (let i = 0; i < 28 * 28; i++) {
        let val = dataset.train_images[trainingIndex][i]
        imageObject.pixels[4 * i + 0] = val;
        imageObject.pixels[4 * i + 1] = val;
        imageObject.pixels[4 * i + 2] = val;
        imageObject.pixels[4 * i + 3] = 255;
    }
    imageObject.updatePixels();
    image(imageObject, 0, 0, width, height);
    addChartData(trainingError(), testError());
}

function trainingError() {
    return calcError(dataset.train_images, dataset.train_labels);
}

function testError() {
    return calcError(dataset.test_images, dataset.test_labels);
}

function calcError(images, labels) {
    const iterations = 100;
    let wrongPredictions = 0;
    for (let j = 0; j < iterations; j++) {
        let i = Math.floor(Math.random() * labels.length);
        let nnInput = [];
        for (let k = 0; k < 28 * 28; k++) {
            nnInput[k] = images[i][k];
        }
        let prediction = nn.predict(nnInput);

        let guess = 0;
        for (let k = 1; k < prediction.length; k++) {
            if (prediction[k] > prediction[guess]) {
                guess = k;
            }
        }
        wrongPredictions += guess == labels[i] ? 0 : 1;
    }

    return wrongPredictions / iterations;
}

function addChartData(training, test) {
    let label = fitnessChart.data.labels.length; 
    fitnessChart.data.labels.push(label);
    fitnessChart.data.datasets[0].data.push(training);
    fitnessChart.data.datasets[1].data.push(test);
    fitnessChart.update();
}