class Node {
    constructor(position) {
        this.position = position
    }
}

class StatementNode extends Node {
    constructor(position, left, right) {
        super(position)
        this.left = left
        this.right = right
    }
}

class UnStatementNode extends Node {
    constructor(position, left) {
        super(position)
        this.left = left
    }
}

class VariableNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class AssignNode extends Node {
    constructor(position, name, value) {
        super(position)
        this.name = name
        this.value = value
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
