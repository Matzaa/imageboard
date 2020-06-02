class Rectangle {
    constructor() {
        this.width = 10;
        this.height = 15;
    }
    getArea() {
        return this.width * this.height;
    }
}

let r = new Rectangle(7, 53);
console.log("r variable", r);

class Mammal {
    constructor() {
        this.lungs = 2;
        this.blood = "warm";
        this.cute = true;
        this.brain = "advanced";
        this.toes = 10;
    }
    cry() {
        return "awooga";
    }
}

class Dog extends Mammal {
    constructor() {
        super();
    }
}
