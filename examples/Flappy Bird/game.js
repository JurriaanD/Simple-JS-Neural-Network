const nbPipes = 8;
const xSpeed = 3;
const pipeDist = 500;
const xOffset = 100;

class Game {
    constructor(nbBirds) {
        this.deadBirds = [];
        if (nbBirds != undefined) {
            this.birds = [];
            for (let i = 0; i < nbBirds; i++) {
                this.birds.push(new Bird());
            }
        } else {
            this.birds = [new Bird(height/2)];
        }      
       
        this.pipes = [];
        this.score = 0;
        this.initPipes();        
    }

    initPipes() {
        this.pipes = [];
        for (let i = 0; i < nbPipes; i++) {
            this.pipes.push(new Pipe(750 + pipeDist*i));
        }
    }

    drawScore() {
        strokeWeight(5);
        stroke(0);
        fill(255);
        textSize(50);
        text(Math.round(this.birds[0].score/2), width/2, 50);
    }

    tick() {
        for (let pipe of this.pipes) {
            pipe.update();
        }

        for (let i = this.birds.length - 1; i >= 0; i--) {
            let bird = this.birds[i];
            bird.update(this.pipes[0]);

            if (bird.isDead(this.pipes[0])) {
                this.deadBirds.unshift(bird);
                this.birds.splice(i, 1);
            }
        }

        if (this.isGameOver()) {
            return;
        }
       
        if (this.pipes[0].x + this.pipes[0].pipeWidth < this.birds[0].x - this.birds[0].r) {
                for (let bird of this.birds) {
                    bird.score += 2;
                }
                this.score++;
                this.pipes.push(this.pipes.shift());          
        }
    }

    isGameOver() {
        return this.birds.length == 0;
    }

    drawBirds() {
        background(0);
        fill(255, 50);
        translate(xOffset, 0);
        for (let bird of this.birds) {
            bird.render();
        }        
    }

    draw() {
        this.drawBirds();
        for (let pipe of this.pipes) {
            pipe.render();
        } 
        
        translate(-1*xOffset, 0);
        this.drawScore();
    }

    privateBirdTime() {
        const VIPPrivilege = 10;

        this.deadBirds = this.deadBirds.concat(this.birds);
        this.birds = [];

        // Calculate the normalized fitness for all birds
        let totalFitness = this.deadBirds.reduce((current, next) => current + next.score, 0);
        console.log(totalFitness);
        for (let i = 0; i < nbBirds; i++) {
            this.deadBirds[i].score /= totalFitness;
        }

        // Revive the best birds for the next generation
        this.deadBirds.sort(birdComparator);
        for (let i = 0; i < VIPPrivilege; i++) {
            this.birds.push(new Bird(this.deadBirds[i].nn));
        }        
        
        for (let i = 0; i < nbBirds - VIPPrivilege; i++) {
            // Pick bird based on relative fitness
            let idx = 0;
            let r = Math.random();
            while (r > 0) {
                r -= this.deadBirds[idx++];
            }

            this.birds.push(new Bird(this.deadBirds[--idx].nn.clone().mutate(0.01)));
        }

        this.deadBirds = [];
        this.initPipes();
        this.score = 0;        
    }
}

function birdComparator(a, b) {
    return (a.score < b.score) ? 1 : -1;
}