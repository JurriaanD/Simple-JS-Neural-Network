let nn;
let dataset;
let imageObject;
let trainingIndex = 0;

function setup() {
  createCanvas(200, 200);
  pixelDensity(1);
  imageObject = createImage(28, 28);
  loadMNIST(function(data) {
    dataset = data;
  });
  nn = new NeuralNetwork(784, [32, 16], 10);
}

function draw() {
  if (dataset) {
    // Dataset is loaded
    // Train x times, then test
    for (let i = 0; i < 10; i++) {
      train(false);
    }
    train(true);
    
    if (Math.random() > 0.9) {
      let fitness = test();
      console.log(fitness + "%");
    }    
  }
}

function train(shouldShow) {
  if (shouldShow) {
    imageObject.loadPixels();
  }

  let nnInput = [];  
  for (let i = 0; i < 28*28; i++) {
    let val = dataset.train_images[trainingIndex][i]
    nnInput[i] = val/255;
    if (shouldShow) {
      imageObject.pixels[4*i + 0] = val;
      imageObject.pixels[4*i + 1] = val;
      imageObject.pixels[4*i + 2] = val;
      imageObject.pixels[4*i + 3] = 255;
    }    
  }

  if (shouldShow) {
    imageObject.updatePixels();
    image(imageObject, 0, 0, width, height);
  }  

  // Actually train the network
  let expectedOutput = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  expectedOutput[dataset.train_labels[trainingIndex]] = 1;
  nn.train(nnInput, expectedOutput);

  trainingIndex++;
  if (trainingIndex >= dataset.train_images.length) {
    noLoop();
    console.log("Done training!");
  }
}

function test() {
  const iterations = 200;
  let score = 0;
  for(let j = 0; j < iterations; j++) {
    let i = Math.floor(Math.random() * dataset.test_labels.length);
    let nnInput = [];
    for (let k = 0; k < 28*28; k++) {
      nnInput[k] = dataset.test_images[i][k];
    }
    let prediction = nn.predict(nnInput);

    let guess = 0;
    for (let k = 1; k < prediction.length; k++) {
      if (prediction[k] > prediction[guess]) {guess = k;}
    }
    score += guess == dataset.test_labels[i] ? 1 : 0;
  }

  return Math.round(score/iterations * 100 * 100) / 100;
}