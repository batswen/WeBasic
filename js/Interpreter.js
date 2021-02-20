class DataType {
    constructor() {
        this.context = undefined
        this.position = undefined
    }
    setPosition(position) {
        this.position = position
        return this
    }
    setContext(context) {
        this.context = context
        return this
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
    eq(other) {
        this.value = this.value === other.value ? 1 : 0
        return this
    }
    ne(other) {
        this.value = this.value !== other.value ? 1 : 0
        return this
    }
    lt(other) {
        this.value = this.value < other.value ? 1 : 0
        return this
    }
    le(other) {
        this.value = this.value <= other.value ? 1 : 0
        return this
    }
    gt(other) {
        this.value = this.value > other.value ? 1 : 0
        return this
    }
    ge(other) {
        this.value = this.value >= other.value ? 1 : 0
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
    or(other) {
        this.value = this.value | other.value
        return this
    }
    and(other) {
        this.value = this.value & other.value
        return this
    }
    eq(other) {
        this.value = this.value === other.value ? 1 : 0
        return this
    }
    ne(other) {
        this.value = this.value !== other.value ? 1 : 0
        return this
    }
    lt(other) {
        this.value = this.value < other.value ? 1 : 0
        return this
    }
    le(other) {
        this.value = this.value <= other.value ? 1 : 0
        return this
    }
    gt(other) {
        this.value = this.value > other.value ? 1 : 0
        return this
    }
    ge(other) {
        this.value = this.value >= other.value ? 1 : 0
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
    eq(other) {
        this.value = this.value === other.value ? 1 : 0
        return this
    }
    ne(other) {
        this.value = this.value !== other.value ? 1 : 0
        return this
    }
    lt(other) {
        this.value = this.value < other.value ? 1 : 0
        return this
    }
    le(other) {
        this.value = this.value <= other.value ? 1 : 0
        return this
    }
    gt(other) {
        this.value = this.value > other.value ? 1 : 0
        return this
    }
    ge(other) {
        this.value = this.value >= other.value ? 1 : 0
        return this
    }
}

class Interpreter {
    constructor(ast) {
        this.ast = ast
    }
    visit_StatementNode(node, ctx) {
        this.visit(node.left, ctx)
        this.visit(node.right, ctx)
    }
    visit_UnStatementNode(node, ctx) {
        this.visit(node.left, ctx)
    }
    visit_VariableNode(node, ctx) {
        if (ctx.symbolTable.testVar(node.value)) {
            return ctx.symbolTable.getVar(node.value)
        } else {
            throw {
                msg: "Interpreter: undeclared variable: " + node.value
            }
        }
    }
    visit_IntNode(node, ctx) {
        return new IntNumber(node.value).setContext(ctx)
    }
    visit_FloatNode(node, ctx) {
        return new FloatNumber(node.value).setContext(ctx)
    }
    visit_StringNode(node, ctx) {
        return new DTString(node.value).setContext(ctx)
    }
    visit_AssignNode(node, ctx) {
        let value = this.visit(node.value, ctx)
        if (value instanceof IntNumber) {
            ctx.symbolTable.setVar(node.name, new IntNumber(value))
        } else if (value instanceof FloatNumber) {
            ctx.symbolTable.setVar(node.name, new FloatNumber(value))
        } else {
            ctx.symbolTable.setVar(node.name, new DTString(value))
        }
    }
    visit_UnOpNode(node, ctx) {
        const left = this.visit(node.left, ctx)
        let result = left
        if (node.operator.tokentype === TokenType.MINUS) {
            if (!left instanceof BaseNumber) {
                throw {
                    msg: "Interpreter: Number expected"
                }
            }
            if (left instanceof IntNumber) {
                result = new IntNumber(-left.value).setContext(ctx)
            } else if (left instanceof FloatNumber ) {
                result = new FloatNumber(-left.value).setContext(ctx)
            }
        }
        return result
    }
    visit_BinOpNode(node, ctx) {
        const left = this.visit(node.left, ctx)
        const right = this.visit(node.right, ctx)

        switch (node.operator.tokentype) {
            case TokenType.PLUS:
                if (left instanceof IntNumber && right instanceof BaseNumber) {
                    return new IntNumber(left).add(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof BaseNumber) {
                    return new FloatNumber(left).add(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).add(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (+)"
                    }
                }
                break
            case TokenType.MINUS:
                if (left instanceof IntNumber && right instanceof BaseNumber) {
                    return new IntNumber(left).sub(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof BaseNumber) {
                    return new FloatNumber(left).sub(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (-)"
                    }
                }
                break
            case TokenType.MUL:
                if (left instanceof IntNumber && right instanceof BaseNumber) {
                    return new IntNumber(left).mul(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof BaseNumber) {
                    return new FloatNumber(left).mul(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof BaseNumber) {
                    return new DTString(left).mul(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (*)"
                    }
                }
                break
            case TokenType.DIV:
                if (left instanceof IntNumber && right instanceof BaseNumber) {
                    return new IntNumber(left).div(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof BaseNumber) {
                    return new FloatNumber(left).div(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (/)"
                    }
                }
                break
            case TokenType.KEYWORD:
                switch (node.operator.value) {
                    case "OR":
                        if (left instanceof IntNumber && right instanceof IntNumber) {
                            return new IntNumber(left).or(right).setContext(ctx)
                        } else {
                            throw {
                                msg: "Interpreter: Unknown datatype (or)"
                            }
                        }
                        break
                    case "AND":
                        if (left instanceof IntNumber && right instanceof IntNumber) {
                            return new IntNumber(left).and(right).setContext(ctx)
                        } else {
                            throw {
                                msg: "Interpreter: Unknown datatype (and)"
                            }
                        }
                        break
                }
            case TokenType.EQ:
                if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).eq(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof FloatNumber) {
                    return new FloatNumber(left).eq(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).eq(right).setContext(ctx)
                } else{
                    throw {
                        msg: "Interpreter: Unknown datatype (==)"
                    }
                }
                break
            case TokenType.NE:
                if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).ne(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof FloatNumber) {
                    return new FloatNumber(left).ne(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).ne(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (!=)"
                    }
                }
                break
            case TokenType.LT:
                if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).lt(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof FloatNumber) {
                    return new FloatNumber(left).lt(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).lt(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (<)"
                    }
                }
                break
            case TokenType.LE:
                if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).le(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof FloatNumber) {
                    return new FloatNumber(left).le(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).le(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (<=)"
                    }
                }
                break
            case TokenType.GT:
                if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).gt(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof FloatNumber) {
                    return new FloatNumber(left).gt(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).gt(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (>)"
                    }
                }
                break
            case TokenType.GE:
                if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).ge(right).setContext(ctx)
                } else if (left instanceof FloatNumber && right instanceof FloatNumber) {
                    return new FloatNumber(left).ge(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).ge(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (>=)"
                    }
                }
                break
        }

    }
    visit(node, ctx) {
        return this[`visit_${node.constructor.name}`](node, ctx)
    }
    interpret() {
        const ctx = new Context("main")
        ctx.symbolTable.setVar("pi", new FloatNumber(Math.PI))
        let res = this.visit(this.ast, ctx)
        ctx.symbolTable.showVars()
        return res
    }
}
