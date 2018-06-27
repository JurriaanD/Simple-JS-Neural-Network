class Pipe {
    constructor(x) {
        this.init(x);
    }

    init(x) {
        this.top = ceil(random(0.25 * height, 0.55 * height));
        this.bottom = this.top + 200;
        this.x = x;
        this.pipeWidth = assets["pipeUp"].width;
    }

    hit(bird) {
        if (bird.x + bird.r >= this.x && this.x + this.pipeWidth >= bird.x - bird.r) {
            if (bird.y - bird.r < this.top || bird.y + bird.r > this.bottom) {
                return true;
            }
        }
        return false;
    }

    update() {
        this.x -= xSpeed;
        if (this.x + 2*this.pipeWidth < 0) {
            this.init(this.x + nbPipes * pipeDist);
        }
    }

    render() {
        image(assets["pipeUp"], this.x, this.bottom);
        image(assets["pipeDown"], this.x, this.top-assets["pipeDown"].height);
    }

}