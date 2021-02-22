class Interpreter {
    constructor(ast) {
        this.ast = ast
        this.output = document.getElementById("output")
    }
    visit_FuncDefNode(node, ctx) {
        ctx.symbolTable.setVar(node.identifier, new DefFunction(node.identifier, node.prog))
    }
    visit_FuncCallNode(node, ctx) {
        const func = ctx.symbolTable.getVar(node.identifier)
        const context = new Context(node.identifier, ctx)
        this.visit(func.prog, context)
    }
    visit_NamespaceNode(node, ctx) {
        const context = new Context(node.namespace, ctx)
        this.visit(node.prog, context)
    }
    visit_DumpNode(node, ctx) {
        this.output.value += ctx.symbolTable.getAllVars().join("\n") + "\n"
    }
    visit_ClsNode(node, ctx) {
        this.output.value = ""
    }
    visit_PrintNode(node, ctx) {
        if (node.args !== undefined) {
            for (let e of node.args) {
                this.output.value += this.visit(e, ctx).value
            }
        }
    }
    visit_PrintLNNode(node, ctx) {
        if (node.args !== undefined) {
            for (let e of node.args) {
                this.output.value += this.visit(e, ctx).value
            }
        }
        this.output.value += "\n"
    }
    visit_CDumpNode(node, ctx) {
        console.log(ctx.symbolTable.getAllVars())
    }
    visit_CPrintNode(node, ctx) {
        if (node.args !== undefined) {
            for (let e of node.args) {
                console.log(this.visit(e, ctx).value)
            }
        }
    }
    visit_WhileNode(node, ctx) {
        while (this.visit(node.condition, ctx).value !== 0) {
            this.visit(node.whiledo, ctx)
        }
    }
    visit_IfNode(node, ctx) {
        if (this.visit(node.condition, ctx).value !== 0) {
            this.visit(node.ifthen, ctx)
        } else {
            if (node.ifelse !== undefined) {
                this.visit(node.ifelse, ctx)
            }
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
    visit_IdentifierNode(node, ctx) {
        if (ctx.symbolTable.testVar(node.identifier)) {
            if (node.access) {
                const index = this.visit(node.access, ctx).value
                const listVar = ctx.symbolTable.getVar(node.identifier)
                if (index < 0 || index >= listVar.value.length) {
                    throw {
                        msg: `Interpreter: index out of bounds (${index})`,
                        position: node.position
                    }
                }
                return listVar.value[index]
            }
            return ctx.symbolTable.getVar(node.identifier)
        } else {
            throw {
                msg: "Interpreter: undeclared variable: " + node.identifier,
                position: node.position
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
    visit_ListNode(node, ctx) {
        if (node.access) {
            const index = this.visit(node.access, ctx).value
            if (index < 0 || index >= node.args.length) {
                throw {
                    msg: `Interpreter: index out of bounds (${index})`,
                    position: node.position
                }
            }
            return this.visit(node.args[index], ctx)
        }
        return new DTList(node.args).setContext(ctx)
    }
    visit_AssignNode(node, ctx) {
        let value = this.visit(node.value, ctx)
        if (value instanceof IntNumber) {
            ctx.symbolTable.setVar(node.name, new IntNumber(value).setContext(ctx))
        } else if (value instanceof FloatNumber) {
            ctx.symbolTable.setVar(node.name, new FloatNumber(value).setContext(ctx))
        } else if (value instanceof DTList) {
            if (node.access) {
                const index = this.visit(node.access, ctx).value
                if (index < 0 || index >= node.args.length) {
                    throw {
                        msg: `Interpreter: index out of bounds (${index})`,
                        position: node.position
                    }
                }
                ctx.symbolTable.setVar(node.name, this.visit(node.args[index], ctx))
            } else {
                const list = []
                if (value?.value?.value) { //
                    for (let e of value.value.value) {
                        list.push(this.visit(e, ctx))
                    }
                } else if (value?.value) {
                    for (let e of value.value) {
                        list.push(this.visit(e, ctx))
                    }
                }
                ctx.symbolTable.setVar(node.name, new DTList(list).setContext(ctx))
            }
        } else {
            ctx.symbolTable.setVar(node.name, new DTString(value).setContext(ctx))
        }
    }
    visit_UnOpNode(node, ctx) {
        const left = this.visit(node.left, ctx)
        let result = left
        if (node.operator.tokentype === TokenType.MINUS) {
            if (!left instanceof BaseNumber) {
                throw {
                    msg: "Interpreter: Number expected",
                    position: left.position
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
                } else if (left instanceof DTList && right instanceof DTList) {
                    return new DTList(left).add(right).setContext(ctx)
                } else {
                    throw {
                        msg: `Interpreter: Type mismatch (+) [${typeof left}, ${typeof right}]`,
                        position: node.position
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
                        msg: "Interpreter: Type mismatch (-)",
                        position: node.position
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
                        msg: "Interpreter: Type mismatch (*)",
                        position: node.position
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
                        msg: "Interpreter: Type mismatch (/)",
                        position: node.position
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
                                msg: "Interpreter: Type mismatch (or)",
                                position: node.position
                            }
                        }
                        break
                    case "AND":
                        if (left instanceof IntNumber && right instanceof IntNumber) {
                            return new IntNumber(left).and(right).setContext(ctx)
                        } else {
                            throw {
                                msg: "Interpreter: Type mismatch (and)",
                                position: node.position
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
                        msg: "Interpreter: Type mismatch (==)",
                        position: node.position
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
                        msg: "Interpreter: Type mismatch (!=)",
                        position: node.position
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
                        msg: "Interpreter: Type mismatch (<)",
                        position: node.position
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
                        msg: "Interpreter: Type mismatch (<=)",
                        position: node.position
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
                        msg: "Interpreter: Type mismatch (>)",
                        position: node.position
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
                        msg: "Interpreter: Type mismatch (>=)",
                        position: node.position
                    }
                }
                break
        }

    }
    visit(node, ctx) {
        // console.log(node.constructor.name)
        return this[`visit_${node.constructor.name}`](node, ctx)
    }
    interpret() {
        const ctx = new Context("main")
        ctx.symbolTable.setVar("pi", new FloatNumber(Math.PI))
        const result = this.visit(this.ast, ctx)
        return result
    }
}
