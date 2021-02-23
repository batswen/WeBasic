class Interpreter {
    constructor(ast) {
        this.ast = ast
        this.output = document.getElementById("output")
        this.return = undefined
        this.shouldReturn = false
        this.errorMsg = undefined
    }
    error(msg, position, details = undefined) {
        this.errorMsg = { msg, position, details }
        throw "error"
    }
    visit_FuncDefNode(node, ctx) {
        ctx.symbolTable.setVar(node.identifier, new DefFunction(node.identifier, node.prog, node.args))
    }
    visit_FuncCallNode(node, ctx) {
        this.return = undefined
        this.shouldReturn = false
        const func = ctx.symbolTable.getVar(node.identifier)
        if (!func) {
            this.error(`unknown function ${node.identifier}`, node.position)
        }
        const context = new Context(node.identifier, ctx)
        if (func.params?.length !== node.args?.length) {
            const flen = func.params?.length || 0
            const alen = node.args?.length || 0
            this.error(`incorrect amount of args, expected ${flen} given ${alen}`, node.position)
        }
        if (func.params) {
            func.params.forEach(e => { this.visit(e, context) })
            for (let i = 0; i < func.params.length; i++) {
                context.symbolTable.setVar(func.params[i].identifier, this.visit(node.args[i], ctx))
            }
        }
        this.visit(func.prog, context)
        this.shouldReturn = false
        if (this.return) {
            return this.return
        } else {
            return new DTString("undefined") // RETURN
        }
    }
    visit_ReturnNode(node, ctx) {
        if (node.value) {
            this.return = this.visit(node.value, ctx)
        } else {
            this.return = undefined
        }
        this.shouldReturn = true
    }
    visit_RandomNode(node, ctx) {
        return new FloatNumber(Math.random())
    }
    visit_LeftNode(node, ctx) {
        const str = this.visit(node.str, ctx)
        const num = this.visit(node.num, ctx)
        if (str instanceof DTString && num instanceof BaseNumber) {
            if (str.getLen() < num.value) {
                this.error(`LEFT(${str.str()}, ${num.str()})`, node.position)
            } else {
                return new DTString(str.value.substring(0, num.value)).setContext(ctx)
            }
        } else {
            this.error(`LEFT(${str.str()}, ${num.str()})`, node.position)
        }
        return new DTNull()
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
    visit_DeclareIdentifierNode(node, ctx) {
        if (ctx.symbolTable.testVarThisContext(node.identifier)) {
            this.error(`redeclaration of ${node.identifier}`, node.position)
        }
        ctx.symbolTable.setVar(node.identifier, undefined)
    }
    visit_IdentifierNode(node, ctx) {
        if (ctx.symbolTable.testVar(node.identifier)) {
            if (node.access) {
                const index = this.visit(node.access, ctx).value
                const listVar = ctx.symbolTable.getVar(node.identifier)
                return listVar.getElement(index)
            }
            return ctx.symbolTable.getVar(node.identifier)
        } else {
            this.error(`undeclared variable: ${node.identifier}`, node.position)
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
        let index
        if (node.access) {
            index = this.visit(node.access, ctx).value
        }
        const list = []
        node.args.forEach(e => list.push(this.visit(e, ctx)))
        if (node.access) {
            return new DTList(list).setContext(ctx).getElement(index)
        } else {
            return new DTList(list).setContext(ctx)
        }
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
                    this.error(`index out of bounds (${index})`, node.position)
                }
                ctx.symbolTable.setVar(node.name, this.visit(node.args[index], ctx))
            } else {
                ctx.symbolTable.setVar(node.name, new DTList(value).setContext(ctx))
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
                this.error("Number expected", left.position)
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
                    this.error(`Type mismatch (+) [${typeof left}, ${typeof right}]`, node.position)
                }
                break
            case TokenType.MINUS:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).sub(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).sub(right).setContext(ctx)
                } else {
                    this.error("Type mismatch (-)", node.position)
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
                    this.error("Type mismatch (*)", node.position)
                }
                break
            case TokenType.DIV:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).div(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).div(right).setContext(ctx)
                } else {
                    this.error("Type mismatch (/)", node.position)
                }
                break
            case TokenType.KEYWORD:
                switch (node.operator.value) {
                    case "OR":
                        if (left instanceof IntNumber && right instanceof IntNumber) {
                            return new IntNumber(left).or(right).setContext(ctx)
                        } else {
                            this.error("Type mismatch (or)", node.position)
                        }
                        break
                    case "AND":
                        if (left instanceof IntNumber && right instanceof IntNumber) {
                            return new IntNumber(left).and(right).setContext(ctx)
                        } else {
                            this.error("Type mismatch (and)", node.position)
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
                    this.error("Type mismatch (==)", node.position)
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
                    this.error("Type mismatch (!=)", node.position)
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
                    this.error("Type mismatch (<)", node.position)
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
                    this.error("Type mismatch (<=)", node.position)
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
                    this.error("Type mismatch (>)", node.position)
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
                    this.error("Type mismatch (>=)", node.position)
                }
                break
        }

    }
    visit(node, ctx) {
        // console.log(node.constructor.name)
        if (this.errorMsg === undefined && this.shouldReturn === false) {
            return this[`visit_${node.constructor.name}`](node, ctx)
        }
    }
    interpret() {
        const ctx = new Context("main")
        ctx.symbolTable.setVar("pi", new FloatNumber(Math.PI))
        try {
            this.visit(this.ast, ctx)
        } catch (e) {
            console.log(e)
            return this.errorMsg
        }
        return undefined
    }
}
