class Tensor {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }

    map(func) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.data[y][x] = func(this.data[y][x], x, y);
            }
        }
        return this;
    }

    static map(tensor, func) {
        if (!(tensor instanceof Tensor)) throw new Error("First argument should be a tensor.");
        let result = new Tensor(tensor.rows, tensor.cols);
        for (let y = 0; y < tensor.rows; y++) {
            for (let x = 0; x < tensor.cols; x++) {
                result.data[y][x] = func(tensor.data[y][x], x, y);
            }
        }
        return result;
    }

    static mul(tensor, other) {
        if (!(tensor instanceof Tensor)) throw new Error("First argument has to be a tensor.");

        if (!isNaN(other)) {
            let result = tensor.copy();
            result.map(x => x * other);
            return result;
        } else if (other instanceof Tensor) {
            if (tensor.cols != other.rows) throw new Error("Incompatible dimensions");

            let result = new Tensor(tensor.rows, other.cols);
            result.map((val, x, y) => {
                let cumsum = 0;
                for (let a = 0; a < tensor.cols; a++) {
                    cumsum += tensor.data[y][a] * other.data[a][x];
                }
                return cumsum;
            });
            return result;
        } else {
            throw new Error("Second argument has to be a number or tensor.");
        }
    }

    static add(tensor, other) {
        if (!(tensor instanceof Tensor)) throw new Error("First argument has to be a tensor.");
        
        if (!isNaN(other)) { 
            let result = tensor.copy();           
            result.map((val, x, y) => val + other);
            return result;
        } else if (other instanceof Tensor) {
            if (other.cols != tensor.cols || other.rows != tensor.rows) throw new Error("Incompatible dimensions.");
            let result = tensor.copy();
            result.map((val, x, y) => val + other.data[y][x]);
            return result;
        } else {
            throw new Error("Unsupported operation");
        }
    }

    static sub(tensor, other) {
        if (!(tensor instanceof Tensor)) throw new Error("First argument has to be a tensor.");
        
        if (!isNaN(other)) { 
            let result = tensor.copy();           
            result.map((val, x, y) => val - other);
            return result;
        } else if (other instanceof Tensor) {
            if (other.cols != tensor.cols || other.rows != tensor.rows) throw new Error("Incompatible dimensions.");
            let result = tensor.copy();
            result.map((val, x, y) => val - other.data[y][x]);
            return result;
        } else {
            throw new Error("Unsupported operation");
        }
    }

    copy() {
        let result = new Tensor(this.rows, this.cols);
        result.map((val, x, y) => this.data[y][x]);
        return result;
    }

    print() {
        console.table(this.data);
    }

    static transpose(tensor) {
        let result = new Tensor(tensor.cols, tensor.rows);
        result.map((val, x, y) => tensor.data[y][x]);
        return result;
    }

    randomize() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.data[y][x] = Math.random();
            }
        }
        return this;
    }

    static from1DArray(arr) {
        let result = new Tensor(arr.length, 1);
        for (let i = 0; i < arr.length; i++) {
            result.data[i][0] = arr[i];
        }
        return result;
    }

    static tensor1DToArray(tensor) {
        let result = [];
        for (let i = 0; i < tensor.rows; i++) {
            result[i] = tensor.data[i][0];
        }
        return result;
    }
}

if (typeof module !== 'undefined') {
    module.exports = Tensor;
}