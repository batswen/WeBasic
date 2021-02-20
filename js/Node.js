class Node {
    constructor(position) {
        this.position = position
    }
}

class StringNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
    toString() {
        return `${this.value}`
    }
}

class IntNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
    toString() {
        return `${this.value}`
    }
}

class FloatNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
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
    }
    toString() {
        return `(${this.left} ${this.operator})`
    }
}
