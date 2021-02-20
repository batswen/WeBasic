class BaseNumber {

}

class IntNumber extends BaseNumber {
    constructor(value) {
        super()
        this.value = value
    }
    add(other) {
        if (other instanceof BaseNumber) {
            return new IntNumber(this.value + other.value)
        }
    }
    sub(other) {
        if (other instanceof BaseNumber) {
            return new IntNumber(this.value - other.value)
        }
    }
}

class FloatNumber extends BaseNumber {
    constructor(value) {
        super()
        this.value = value
    }
    add(other) {
        if (other instanceof BaseNumber) {
            return new FloatNumber(this.value + other.value)
        }
    }
    sub(other) {
        if (other instanceof BaseNumber) {
            return new FloatNumber(this.value - other.value)
        }
    }
}

class Interpreter {
    constructor(ast) {
        this.ast = ast
    }
    visit_IntNode(node) {
        return new IntNumber(node.value)
    }
    visit_FloatNode(node) {
        return new FloatNumber(node.value)
    }
    visit_UnOpNode(node) {
        const left = this.visit(node.left)
        let result = left
        if (node.operator.tokentype === TokenType.MINUS) {
            if (!left instanceof BaseNumber) {
                throw "Interpreter: Number expected"
            }
            if (left instanceof IntNumber) {
                result = new IntNumber(-left.value)
            } else if (left instanceof FloatNumber ) {
                result = new FloatNumber(-left.value)
            }
        }
        return result
    }
    visit_BinOpNode(node) {
        const left = this.visit(node.left)
        const right = this.visit(node.right)

        switch (node.operator.tokentype) {
            case TokenType.PLUS:
                if (left instanceof IntNumber) {
                    return new IntNumber(left.value).add(right)
                } else if (left instanceof FloatNumber) {
                    return new FloatNumber(left.value).add(right)
                } else {
                    throw "Interpreter: Unknown datatype (+)"
                }
                break
            case TokenType.MINUS:
                if (left instanceof IntNumber) {
                    return new IntNumber(left.value).sub(right)
                } else if (left instanceof FloatNumber ) {
                    return new FloatNumber(left.value).add(right)
                } else {
                    throw "Interpreter: Unknown datatype (-)"
                }
                break
        }

    }
    visit(node) {
        return this[`visit_${node.constructor.name}`](node)
    }
    interpret() {
        return this.visit(this.ast)
    }
}
