const maxV = 4;

class Bird {
    constructor(nn) {
        this.x = xOffset;
        this.y = height/2;
        this.v = 0;
        this.a = 0.1;
        this.r = 20;
        this.score = 1;
        if (nn instanceof NeuralNetwork) {
            this.nn = nn;
        } else {
            this.nn = new NeuralNetwork(3, [6], 1);
        }        
    }

    render() {
        image(assets["bird"], xOffset - this.r, this.y - this.r);
    }

    update(pipe) {
        // The bird does a thinking
        let nnInputs = [];
        nnInputs[0] = this.y / height;
        nnInputs[1] = (this.y - (pipe.top + (pipe.bottom - pipe.top)/2)) / height;
        nnInputs[2] = this.v / maxV;
        let output = this.nn.predict(nnInputs)[0];
        if (output > 0.5) {
            this.a -= 5;
        }            

        this.v += this.a;
        this.v = Math.sign(this.v) * Math.min(abs(this.v), maxV);
        this.y += this.v;
        this.a = 0.1;
    }

    isDead(pipe) {
        return pipe.hit(this) || this.y < 0 || this.y > height;
    }
}