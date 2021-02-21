class Interpreter {
    constructor(ast) {
        this.ast = ast
    }
    visit_DumpNode(node, ctx) {
        ctx.symbolTable.showVars()
    }
    visit_PrintNode(node, ctx) {
        console.log(this.visit(node.value, ctx).value)
    }
    visit_WhileNode(node, ctx) {
        while (this.visit(node.condition, ctx).value !== 0) {
            this.visit(node.whiledo, ctx)
        }
    }
    visit_IfNode(node, ctx) {
        if (this.visit(node.condition, ctx).value !== 0) {
            this.visit(node.then, ctx)
        }
    }
    visit_IfElseNode(node, ctx) {
        if (this.visit(node.condition, ctx).value !== 0) {
            this.visit(node.ifthen, ctx)
        } else {
            this.visit(node.ifelse, ctx)
        }
    }
    visit_StatementNode(node, ctx) {
        if (node.left !== undefined) {
            this.visit(node.left, ctx)
        }
        if (node.right !== undefined) {
            this.visit(node.right, ctx)
        }
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
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).add(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).add(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).add(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (+)"
                    }
                }
                break
            case TokenType.MINUS:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).sub(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).sub(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (-)"
                    }
                }
                break
            case TokenType.MUL:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).mul(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).mul(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof BaseNumber) {
                    return new DTString(left).mul(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (*)"
                    }
                }
                break
            case TokenType.DIV:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).div(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).div(right).setContext(ctx)
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
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).eq(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).eq(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).eq(right).setContext(ctx)
                } else{
                    throw {
                        msg: "Interpreter: Unknown datatype (==)"
                    }
                }
                break
            case TokenType.NE:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).ne(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).ne(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).ne(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (!=)"
                    }
                }
                break
            case TokenType.LT:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).lt(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).lt(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).lt(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (<)"
                    }
                }
                break
            case TokenType.LE:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).le(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).le(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).le(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (<=)"
                    }
                }
                break
            case TokenType.GT:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).gt(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).gt(right).setContext(ctx)
                } else if (left instanceof DTString && right instanceof DTString) {
                    return new DTString(left).gt(right).setContext(ctx)
                } else {
                    throw {
                        msg: "Interpreter: Unknown datatype (>)"
                    }
                }
                break
            case TokenType.GE:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).ge(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).ge(right).setContext(ctx)
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
        let r =this.visit(this.ast, ctx)
ctx.symbolTable.showVars()
        return r
    }
}
