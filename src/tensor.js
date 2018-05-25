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
            result.map((val, x, y) => val * other);
            return result;
        } else if (other instanceof Tensor) {
            if (tensor.cols != other.cols || tensor.rows != other.rows) 
                throw new Error("Matrices must have the same dimensions for hadamard (element-wise) multiplication.")

            let result = new Tensor(tensor.rows, tensor.cols);
            result.map((val, x, y) => tensor.data[y][x] * other.data[y][x]);
            return result;
        } else {
            throw new Error("Second argument has to be a number or tensor.");
        }
    }

    mul(other) {
        if (!isNaN(other)) {
            this.map((val, x, y) => val * other);
            return this;
        } else if (other instanceof Tensor) {
            if (this.cols != other.cols || this.rows != other.rows) 
                throw new Error("Matrices must have the same dimensions for hadamard (element-wise) multiplication.")
            
            this.map((val, x, y) => val * other.data[y][x]);
            return this;
        } else {
            throw new Error("Second argument has to be a number or tensor.");
        }
    }

    static cross(tensor, other) {
        if (!(tensor instanceof Tensor) || !(other instanceof Tensor)) throw new Error("Arguments should be tensors.");
        if (tensor.cols != other.rows) throw new Error("Incompatible dimensions: " + tensor.rows+"x"+tensor.cols +" and " + other.rows+"x"+other.cols+".");

        let result = new Tensor(tensor.rows, other.cols);
        result.map((val, x, y) => {
            let cumsum = 0;
            for (let a = 0; a < tensor.cols; a++) {
                cumsum += tensor.data[y][a] * other.data[a][x];
            }
            return cumsum;
        });
        return result;
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

    add(other) {
        if (!isNaN(other)) {          
            this.map((val, x, y) => val + other);
            return this;
        } else if (other instanceof Tensor) {
            if (other.cols != this.cols || other.rows != this.rows) throw new Error("Incompatible dimensions.");
            this.map((val, x, y) => val + other.data[y][x]);
            return this;
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

    sub(other) {
        if (!isNaN(other)) {          
            this.map((val, x, y) => val - other);
            return this;
        } else if (other instanceof Tensor) {
            if (other.cols != this.cols || other.rows != this.rows) throw new Error("Incompatible dimensions.");
            this.map((val, x, y) => val - other.data[y][x]);
            return this;
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
        result.map((val, x, y) => tensor.data[x][y]);
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

    static fromArray(arr) {
        if (!(arr instanceof Array)) throw new Error("Argument must be an array.");
        // 1D array is annoying
        if (arr[0].length === undefined) {
            let result = new Tensor(arr.length, 1);
            for (let i = 0; i < arr.length; i++) {
                result.data[i][0] = arr[i];
            }
            return result;
        } else {
            // Probably should check if all rows have the same length
            let result = new Tensor(arr.length, arr[0].length);
            result.map((val, x, y) => arr[y][x]);
            return result;
        }        
    }

    static tensorToArray(tensor) {
        // 1D array
        if (tensor.rows == 1) {
            return tensor.data[0].slice(0);
        } else {
            let result = new Array(tensor.rows);
            for (let y = 0; y < tensor.rows; y++) {
                result[y] = tensor.data[y].slice(0);
            }
        }
        return result;
    }
}

if (typeof module !== 'undefined') {
    module.exports = Tensor;
}