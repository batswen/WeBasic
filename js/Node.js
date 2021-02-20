class Node {
    constructor(position) {
        this.position = position
    }
}

class IntNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
        this.type = "IntNode"
    }
    toString() {
        return `${this.value}`
    }
}

class FloatNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
        this.type = "FloatNode"
    }
    toString() {
        return `${this.value}`
    }
}

class BinOpNode extends Node {
    constructor(position, left, operator, right) {
        super(position)
        this.left = left
        this.operator = operator
        this.right = right
        this.type = "BinOpNode"
    }
    toString() {
        return `(${this.left} ${this.operator} ${this.right})`
    }
}

class UnOpNode extends Node {
    constructor(position, left, operator) {
        super(position)
        this.left = left
        this.operator = operator
        this.type = "UnOpNode"
    }
    toString() {
        return `(${this.left} ${this.operator})`
    }
}
