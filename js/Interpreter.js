class DataType {
    constructor() {
    }
}

class DTString extends DataType {
    constructor(v) {
        super()
        if (v instanceof DTString) {
            this.value = v.value
        } else {
            this.value = v
        }
    }
    add(other) {
        if (other instanceof DTString) {
            this.value = this.value + other.value
        }
        return this
    }
    mul(other) {
        let result = ""
        if (other instanceof BaseNumber) {
            for (let i = 0; i < other.value; i++) {
                result += this.value
            }
        }
        this.value = result
        return this
    }
}

class BaseNumber extends DataType {
    constructor(v) {
        super()
        if (v instanceof BaseNumber) {
            this.value = v.value
        } else {
            this.value = v
        }
    }
}

class IntNumber extends BaseNumber {
    constructor(value) {
        super(value)
    }
    add(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value + other.value
        }
        return this
    }
    sub(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value - other.value
        }
        return this
    }
    mul(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value * other.value
        }
        return this
    }
    div(other) {
        if (other instanceof BaseNumber) {
            if (other.value === 0) {
                throw {
                    msg: "Interpreter: division by zero"
                }
            }
            this.value = this.value / other.value
        }
        return this
    }
}

class FloatNumber extends BaseNumber {
    constructor(value) {
        super(value)
    }
    add(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value + other.value
        }
        return this
    }
    sub(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value - other.value
        }
        return this
    }
    mul(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value * other.value
        }
        return this
    }
    div(other) {
        if (other instanceof BaseNumber) {
            if (other.value === 0) {
                throw {
                    msg: "Interpreter: division by zero"
                }
            }
            this.value = this.value / other.value
        }
        return this
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
    visit_StringNode(node) {
        return new DTString(node.value)
    }
    visit_UnOpNode(node) {
        const left = this.visit(node.left)
        let result = left
        if (node.operator.tokentype === TokenType.MINUS) {
            if (!left instanceof BaseNumber) {
                throw {
                    msg: "Interpreter: Number expected"
                }
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
                if (left instanceof IntNumber && right instanceof BaseNumber) {
                    return new IntNumber(left).add(right)
                } else if (left instanceof FloatNumber && right instanceof BaseNumber) {
                    return new FloatNumber(left).add(right)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).add(right)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (+)"
                    }
                }
                break
            case TokenType.MINUS:
                if (left instanceof IntNumber && right instanceof BaseNumber) {
                    return new IntNumber(left).sub(right)
                } else if (left instanceof FloatNumber && right instanceof BaseNumber) {
                    return new FloatNumber(left).sub(right)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (-)"
                    }
                }
                break
            case TokenType.MUL:
                if (left instanceof IntNumber && right instanceof BaseNumber) {
                    return new IntNumber(left).mul(right)
                } else if (left instanceof FloatNumber && right instanceof BaseNumber) {
                    return new FloatNumber(left).mul(right)
                } else if (left instanceof DTString && right instanceof BaseNumber) {
                    return new DTString(left).mul(right)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (*)"
                    }
                }
                break
            case TokenType.DIV:
                if (left instanceof IntNumber && right instanceof BaseNumber) {
                    return new IntNumber(left).div(right)
                } else if (left instanceof FloatNumber && right instanceof BaseNumber) {
                    return new FloatNumber(left).div(right)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (/)"
                    }
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
