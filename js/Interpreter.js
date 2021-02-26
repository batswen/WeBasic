class Interpreter {
    constructor(ast) {
        this.ast = ast
        this.output = document.getElementById("output")
        this.return = undefined
        this.shouldReturn = false
        this.errorMsg = undefined
        this.gfx = document.getElementById("gfxoutput").getContext("2d")
        this.gfx.fillStyle = 'rgb(0, 0, 0)'
        this.gfx.strokeStyle = 'rgb(0, 0, 0)'
        this.gfx.lineWidth = '1'
    }
    error(msg, position, details = undefined) {
        this.errorMsg = { msg, position, details }
        throw "error"
    }
    visit_FuncDefNode(node, ctx) {
        if (ctx.symbolTable.declareVar(node.identifier) === undefined) {
            this.error(`Redeclaration of ${node.identifier}`, node.position)
        }
        ctx.symbolTable.setVar(node.identifier, new DefFunction(node.identifier, node.prog, node.args))
    }
    visit_FuncCallNode(node, ctx) {
        this.return = undefined
        this.shouldReturn = false
        const func = ctx.symbolTable.getVar(node.identifier)
        if (!func) {
            this.error(`Unknown function ${node.identifier}`, node.position)
        }
        const context = new Context(node.identifier, ctx)
        if (func.params?.length !== node.args?.length) {
            const flen = func.params?.length || 0
            const alen = node.args?.length || 0
            this.error(`Incorrect amount of args, expected ${flen} given ${alen}`, node.position)
        }
        if (func.params) {
            // Declare formal parameters
            func.params.forEach(e => { this.visit(e, context) })
            // Fill with args
            for (let i = 0; i < func.params.length; i++) {
                if (context.symbolTable.setVar(func.params[i].identifier, this.visit(node.args[i], ctx)) === undefined) {
                    this.error(`Undeclared variable ${func.params[i].identifier}`, node.position)
                }
            }
        }
        this.visit(func.prog, context)
        this.shouldReturn = false
        if (this.return) {
            return this.return
        } else {
            return new DTNull() // RETURN
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
    visit_LenNode(node, ctx) {
        const arg =  this.visit(node.len, ctx)
        if (!(arg instanceof DTString || arg instanceof DTList)) {
            this.error(`Argument must be String or List (LEN(${arg.value}))`, node.position)
        }
        return new IntNumber(arg.getLen())
    }
    visit_RoundNode(node, ctx) {
        const arg =  this.visit(node.arg, ctx)
        if (!(arg instanceof BaseNumber)) {
            this.error(`Argument must be a number (ROUND(${arg.value}))`, node.position)
        }
        return new IntNumber(Math.round(arg.value))
    }
    visit_FloorNode(node, ctx) {
        const arg =  this.visit(node.arg, ctx)
        if (!(arg instanceof BaseNumber)) {
            this.error(`Argument must be a number (FLOOR(${arg.value}))`, node.position)
        }
        return new IntNumber(Math.floor(arg.value))
    }
    visit_CeilNode(node, ctx) {
        const arg =  this.visit(node.arg, ctx)
        if (!(arg instanceof BaseNumber)) {
            this.error(`Argument must be a number (CEIL(${arg.value}))`, node.position)
        }
        return new IntNumber(Math.ceil(arg.value))
    }
    visit_SinNode(node, ctx) {
        const arg =  this.visit(node.arg, ctx)
        if (!(arg instanceof BaseNumber)) {
            this.error(`Argument must be a number (SIN(${arg.value}))`, node.position)
        }
        return new IntNumber(Math.sin(arg.value))
    }
    visit_CosNode(node, ctx) {
        const arg =  this.visit(node.arg, ctx)
        if (!(arg instanceof BaseNumber)) {
            this.error(`Argument must be a number (COS(${arg.value}))`, node.position)
        }
        return new IntNumber(Math.cos(arg.value))
    }
    visit_TanNode(node, ctx) {
        const arg =  this.visit(node.arg, ctx)
        if (!(arg instanceof BaseNumber)) {
            this.error(`Argument must be a number (TAN(${arg.value}))`, node.position)
        }
        return new IntNumber(Math.tan(arg.value))
    }
    visit_AbsNode(node, ctx) {
        const arg =  this.visit(node.arg, ctx)
        if (!(arg instanceof BaseNumber)) {
            this.error(`Argument must be a number (ROUND(${arg.value}))`, node.position)
        }
        return new IntNumber(Math.abs(arg.value))
    }
    visit_RandomNode(node, ctx) {
        return new FloatNumber(Math.random())
    }
    visit_InputNode(node, ctx) {
        const prompt = this.visit(node.prompt, ctx)
        if (!(prompt instanceof DTString)) {
            this.error(`Prompt must be a String (INPUT(${prompt.str()}))`, node.position)
        }
        let input = window.prompt(prompt.value)
        if (typeof input !== "string") {
            input = ""
        }
        return new DTString(input).setContext(ctx)
    }
    visit_LeftNode(node, ctx) {
        const str = this.visit(node.str, ctx)
        const num = this.visit(node.num, ctx)
        if (str instanceof DTString && num instanceof BaseNumber) {
            if (num.value < 0 || str.getLen() < num.value) {
                this.error(`Illegal quantity (LEFT(${str.str()}, ${num.str()}))`, node.position)
            } else {
                return new DTString(str.value.substring(0, num.value)).setContext(ctx)
            }
        } else {
            this.error(`LEFT(${str.str()}, ${num.str()})`, node.position)
        }
        return new DTNull()
    }
    visit_RightNode(node, ctx) {
        const str = this.visit(node.str, ctx)
        const num = this.visit(node.num, ctx)
        if (str instanceof DTString && num instanceof BaseNumber) {
            if (num. value < 0 || str.getLen() < num.value) {
                this.error(`Illegal quantity (RIGHT(${str.str()}, ${num.str()}))`, node.position)
            } else {
                return new DTString(str.value.substr(-num.value)).setContext(ctx)
            }
        } else {
            this.error(`RIGHT(${str.str()}, ${num.str()})`, node.position)
        }
        return new DTNull()
    }
    visit_MidNode(node, ctx) {
        const str = this.visit(node.str, ctx)
        const num = this.visit(node.num, ctx)
        const amount = this.visit(node.amount, ctx)
        if (str instanceof DTString && num instanceof BaseNumber && amount instanceof BaseNumber) {
            if (num.value < 0 || amount.value < 0 || str.getLen() < num.value + amount.value - 1) {
                this.error(`Illegal quantity (MID(${str.str()}, ${num.str()}, ${amount.str()}))`, node.position)
            } else {
                return new DTString(str.value.substr(num.value - 1, amount.value)).setContext(ctx)
            }
        } else {
            this.error(`MID(${str.str()}, ${num.str()}, ${num.str()})`, node.position)
        }
        return new DTNull()
    }
    visit_DateNode(node, ctx) {
        return new DTString(new Date().toLocaleDateString()).setContext(ctx)
    }
    visit_TimeNode(node, ctx) {
        return new DTString(new Date().toLocaleTimeString()).setContext(ctx)
    }
    visit_LineWidthNode(node, ctx) {
        const width = this.visit(node.args[0], ctx)
        if (!(width instanceof BaseNumber)) {
            this.error(`Argument must be a number (STROKE)`, node.position)
        }
        this.gfx.lineWidth = `${width.value}`
    }
    visit_ColorNode(node, ctx) {
        const red = this.visit(node.args[0], ctx)
        const green = this.visit(node.args[1], ctx)
        const blue = this.visit(node.args[2], ctx)
        if (!(red instanceof BaseNumber) || !(green instanceof BaseNumber) || !(blue instanceof BaseNumber)) {
            this.error(`Arguments must be numbers (COLOR)`, node.position)
        }
        if (red.value > 255 || red.value < 0 || green.value < 0 || green.value > 255 || blue.value < 0 || blue.value > 255) {
            this.error(`Illegal quantity, must be in 0..255 (COLOR ${red.value}, ${green.value}, ${blue.value})`, node.position)
        }
        this.gfx.strokeStyle = `rgb(${red.value}, ${green.value}, ${blue.value})`
    }
    visit_FillColorNode(node, ctx) {
        const red = this.visit(node.args[0], ctx)
        const green = this.visit(node.args[1], ctx)
        const blue = this.visit(node.args[2], ctx)
        if (!(red instanceof BaseNumber) || !(green instanceof BaseNumber) || !(blue instanceof BaseNumber)) {
            this.error(`Arguments must be numbers (FILLCOLOR)`, node.position)
        }
        if (red.value > 255 || red.value < 0 || green.value < 0 || green.value > 255 || blue.value < 0 || blue.value > 255) {
            this.error(`Illegal quantity, must be in 0..255 (FILLCOLOR ${red.value}, ${green.value}, ${blue.value})`, node.position)
        }
        this.gfx.fillStyle = `rgb(${red.value}, ${green.value}, ${blue.value})`
    }
    visit_PointNode(node, ctx) {
        const xc = this.visit(node.args[0], ctx)
        const yc = this.visit(node.args[1], ctx)
        if (!(xc instanceof BaseNumber) || !(yc instanceof BaseNumber)) {
            this.error(`Arguments must be numbers (POINT)`, node.position)
        }
        const oldLineWidth = this.gfx.lineWidth
        this.gfx.lineWidth = "1"
        this.gfx.fillRect(xc.value, yc.value, 1, 1)
        this.gfx.lineWidth = oldLineWidth
    }
    visit_LineNode(node, ctx) {
        const xcStart = this.visit(node.args[0], ctx)
        const ycStart = this.visit(node.args[1], ctx)
        const xcEnd = this.visit(node.args[2], ctx)
        const ycEnd = this.visit(node.args[3], ctx)
        if (!(xcStart instanceof BaseNumber) || !(ycStart instanceof BaseNumber) || !(xcEnd instanceof BaseNumber) || !(ycEnd instanceof BaseNumber)) {
            this.error(`Arguments must be numbers (LINE)`, node.position)
        }
        this.gfx.beginPath()
        this.gfx.moveTo(xcStart.value, ycStart.value)
        this.gfx.lineTo(xcEnd.value, ycEnd.value)
        this.gfx.stroke()
    }
    visit_RectNode(node, ctx) {
        const xcStart = this.visit(node.args[0], ctx)
        const ycStart = this.visit(node.args[1], ctx)
        const rectWidth = this.visit(node.args[2], ctx)
        const rectHeight = this.visit(node.args[3], ctx)
        const fillFlag = this.visit(node.args[4], ctx)
        if (!(xcStart instanceof BaseNumber) || !(ycStart instanceof BaseNumber) || !(rectWidth instanceof BaseNumber) || !(rectHeight instanceof BaseNumber)) {
            this.error(`Arguments must be numbers (RECT)`, node.position)
        }
        if (fillFlag.value !== 0) {
            this.gfx.fillRect(xcStart.value, ycStart.value, rectWidth.value, rectHeight.value)
        } else {
            this.gfx.strokeRect(xcStart.value, ycStart.value, rectWidth.value, rectHeight.value)
        }
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
    visit_ForNode(node, ctx) {
        //constructor(position, forIdentifier, forStart, forEnd, forStep, forProg) {
        const forIdentifier = node.forIdentifier.identifier
        this.visit(node.forIdentifier, ctx)
        const forStart = this.visit(node.forStart, ctx)
        const forEnd = this.visit(node.forEnd, ctx)
        const forStep = this.visit(node.forStep, ctx)
        if (!(forStart instanceof FloatNumber) || !(forEnd instanceof FloatNumber) || !(forStep instanceof FloatNumber)) {
            this.error(`Arguments must be floats (FOR)`, node.position)
        }
        if (forStep.value === 0) {
            this.error(`Step can't be zero (FOR)`, node.position)
        }
        if (ctx.symbolTable.setVar(forIdentifier, forStart) === undefined) {
            this.error(`Undeclared variable: ${forIdentifier}`, node.position)
        }
        if (forStep.value > 0) {
            while (ctx.symbolTable.getVar(forIdentifier).value <= forEnd.value) {
                this.visit(node.forProg, ctx)
                ctx.symbolTable.setVar(forIdentifier, ctx.symbolTable.getVar(forIdentifier).add(new FloatNumber(forStep.value).setContext(ctx)))
            }
        } else {
            while (ctx.symbolTable.getVar(forIdentifier).value >= forEnd.value) {
                this.visit(node.forProg, ctx)
                ctx.symbolTable.setVar(forIdentifier, ctx.symbolTable.getVar(forIdentifier).add(new FloatNumber(forStep.value).setContext(ctx)))
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
        if (Array.isArray(node.identifier)) {
            node.identifier.forEach(e => {
                if (ctx.symbolTable.declareVar(e.identifier) === undefined) {
                    this.error(`Redeclaration of ${e.identifier}`, node.position)
                }
            })
        } else {
            if (ctx.symbolTable.declareVar(node.identifier) === undefined) {
                this.error(`Redeclaration of ${node.identifier}`, node.position)
            }
        }
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
            this.error(`Undeclared variable: ${node.identifier}`, node.position)
        }
    }
    visit_IntNode(node, ctx) {
        return new IntNumber(node.value).setContext(ctx)
    }
    visit_IntConvNode(node, ctx) {
        const value = this.visit(node.value, ctx)
        if (value instanceof BaseNumber || value instanceof DTString) {
            return new IntNumber(parseInt(value.value), ctx)
        } else {
            this.error(`Conversion to int error`, node.position)
        }
    }
    visit_FloatConvNode(node, ctx) {
        const value = this.visit(node.value, ctx)
        if (value instanceof BaseNumber || value instanceof DTString) {
            return new FloatNumber(parseFloat(value.value), ctx)
        } else {
            this.error(`Conversion to float error`, node.position)
        }
    }
    visit_StringConvNode(node, ctx) {
        const value = this.visit(node.value, ctx)
        if (value instanceof BaseNumber) {
            return new DTString("" + value.value, ctx)
        } else {
            this.error(`Conversion to string error`, node.position)
        }
    }
    visit_IntTestNode(node, ctx) {
        const value = this.visit(node.value, ctx)
        return new IntNumber(value instanceof IntNumber ? 1 : 0, ctx)
    }
    visit_FloatTestNode(node, ctx) {
        const value = this.visit(node.value, ctx)
        return new IntNumber(value instanceof FloatNumber ? 1 : 0, ctx)
    }
    visit_StringTestNode(node, ctx) {
        const value = this.visit(node.value, ctx)
        return new IntNumber(value instanceof DTString ? 1 : 0, ctx)
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
            const result = new DTList(list).setContext(ctx).getElement(index)
            if (result === undefined) {
                this.error("Index out of bounds", node.position)
            }
            return result
        } else {
            return new DTList(list).setContext(ctx)
        }
    }
    visit_AssignNode(node, ctx) {
        let value = this.visit(node.value, ctx), writeElement = undefined
        if (node.writeAccess) {
            writeElement = this.visit(node.writeAccess, ctx)
            if (!(writeElement instanceof BaseNumber)) {
                this.error("Index must be a number", node.position)
            }
            writeElement = writeElement.value
        }
        if (value instanceof IntNumber || value instanceof FloatNumber || value instanceof DTString) {
            if (ctx.symbolTable.setVar(node.name, value, writeElement) === undefined) {
                this.error(`Undeclared variable ${node.name}`, node.position)
            }
        } else if (value instanceof DTList) {
            if (node.access) {
                const index = this.visit(node.access, ctx).value
                const value = value.getElement(index)
                if (value === undefined) {
                    this.error("Index out of bounds", node.position)
                }
            }
            if (ctx.symbolTable.setVar(node.name, value, writeElement) === undefined) {
                if (writeElement === undefined) {
                    this.error(`Undeclared variable ${node.name}`, node.position)
                } else {
                    this.error("Index out of bounds", node.position)
                }
            }
        }
    }
    visit_UnOpNode(node, ctx) {
        const left = this.visit(node.left, ctx)
        let result = left
        if (node.operator.tokentype === TokenType.MINUS) {
            if (!left instanceof BaseNumber) {
                this.error("Number expected (-)", left.position)
            }
            if (left instanceof IntNumber) {
                result = new IntNumber(-left.value).setContext(ctx)
            } else if (left instanceof FloatNumber ) {
                result = new FloatNumber(-left.value).setContext(ctx)
            }
        } else if (node.operator.tokentype === TokenType.KEYWORD && node.operator.value === "NOT") {
            if (left instanceof IntNumber) {
                return new IntNumber(left.value === 0 ? 1 : 0).setContext(ctx)
            } else {
                this.error("Integer expected (NOT)", left.position)
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
                    this.error(`Type mismatch (-) [${typeof left}, ${typeof right}]`, node.position)
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
                    this.error(`Type mismatch (*) [${typeof left}, ${typeof right}]`, node.position)
                }
                break
            case TokenType.DIV:
                if (left instanceof FloatNumber || right instanceof FloatNumber) {
                    return new FloatNumber(left).div(right).setContext(ctx)
                } else if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).div(right).setContext(ctx)
                } else {
                    this.error(`Type mismatch (/) [${typeof left}, ${typeof right}]`, node.position)
                }
                break
            case TokenType.MOD:
                if (left instanceof IntNumber && right instanceof IntNumber) {
                    return new IntNumber(left).mod(right).setContext(ctx)
                } else {
                    this.error(`Type mismatch (%) [${typeof left}, ${typeof right}]`, node.position)
                }
                break
            case TokenType.KEYWORD:
                switch (node.operator.value) {
                    case "OR":
                        if (left instanceof IntNumber && right instanceof IntNumber) {
                            return new IntNumber(left).or(right).setContext(ctx)
                        } else {
                            this.error(`Type mismatch (or) [${typeof left}, ${typeof right}]`, node.position)
                        }
                        break
                    case "AND":
                        if (left instanceof IntNumber && right instanceof IntNumber) {
                            return new IntNumber(left).and(right).setContext(ctx)
                        } else {
                            this.error(`Type mismatch (and) [${typeof left}, ${typeof right}]`, node.position)
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
                    this.error(`Type mismatch (==) [${typeof left}, ${typeof right}]`, node.position)
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
                    this.error(`Type mismatch (!=) [${typeof left}, ${typeof right}]`, node.position)
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
                    this.error(`Type mismatch (<) [${typeof left}, ${typeof right}]`, node.position)
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
                    this.error(`Type mismatch (<=) [${typeof left}, ${typeof right}]`, node.position)
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
                    this.error(`Type mismatch (>) [${typeof left}, ${typeof right}]`, node.position)
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
                    this.error(`Type mismatch (>=) [${typeof left}, ${typeof right}]`, node.position)
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
        ctx.symbolTable.declareVar("pi")
        ctx.symbolTable.setVar("pi", new FloatNumber(Math.PI).setContext(ctx))
        ctx.symbolTable.declareVar("null")
        ctx.symbolTable.setVar("null", new DTNull().setContext(ctx))
        ctx.symbolTable.declareVar("light")
        ctx.symbolTable.setVar("light", new IntNumber(299792458).setContext(ctx))
        try {
            this.visit(this.ast, ctx)
        } catch (e) {
            if (e !== "error") {
                console.log(e)
            }
        } finally {
            return this.errorMsg
        }
    }
}
