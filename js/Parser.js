class Parser {
    constructor(tokens) {
        this.tokens = tokens
        this.pos = -1
        this.token = undefined
        this.advance()
    }
    advance() {
        if (this.pos < this.tokens.length) {
            this.pos++
            this.token = this.tokens[this.pos]
        } else {
            this.token = undefined
        }
        return this.token
    }
    getArgList(token, idOnly = false) {
        const args = []
        if (idOnly) {
            if (this.token.tokentype === TokenType.IDENTIFIER) {
                args.push(this.factor(idOnly))
            } else {
                throw {
                    msg: "Parser: identifier expected",
                    position: token.position
                }
            }
        } else {
            args.push(this.orexpr())
        }
        while (this.token.tokentype === TokenType.COMMA) {
            this.advance()
            if (idOnly) {
                if (this.token.tokentype === TokenType.IDENTIFIER) {
                    args.push(this.factor(idOnly))
                } else {
                    throw {
                        msg: "Parser: identifier expected",
                        position: token.position
                    }
                }
            } else {
                args.push(this.orexpr())
            }
        }
        return args
    }
    handleFuncCall(token) {
        // args
        let args = undefined

        if (this.token.tokentype !== TokenType.RPAREN) {
            args = this.getArgList(token)
        }
        if (this.token.tokentype !== TokenType.RPAREN) {
            throw {
                msg: "Parser: ')' expected",
                position: token.position
            }
        }
        this.advance()
        return new FuncCallNode(token.position, token.value, args)
    }
    factor(idOnly) {
        const token = this.token
        if (idOnly && token.tokentype !== TokenType.IDENTIFIER) {
            throw {
                msg: "Parser: identifier expected",
                position: token.position
            }
        }
        if (token.tokentype === TokenType.STRING) {
            this.advance()
            return new StringNode(token.position, token.value)
        } else if (token.tokentype === TokenType.INT || token.tokentype === TokenType.FLOAT) {
            this.advance()
            if (token.tokentype === TokenType.INT) {
                return new IntNode(token.position, token.value)
            } else {
                return new FloatNode(token.position, token.value)
            }
        } else if (token.tokentype === TokenType.PLUS || this.token.tokentype === TokenType.MINUS) {
            this.advance()
            return new UnOpNode(token.position, this.factor(), token)
        } else if (token.tokentype === TokenType.LPAREN) {
            this.advance()
            let expr = this.orexpr()
            if (this.token.tokentype === TokenType.RPAREN) {
                this.advance()
                return expr
            } else {
                throw {
                    msg: "Parser: ')' expected",
                    position: token.position
                }
            }
        } else if (token.tokentype === TokenType.LBRACKET) {
            let list = [], access = undefined
            this.advance()
            if (this.token.tokentype !== TokenType.RBRACKET) {
                list.push(this.orexpr())
                while (this.token.tokentype === TokenType.COMMA) {
                    this.advance()
                    list.push(this.orexpr())
                }
            }
            if (this.token.tokentype === TokenType.RBRACKET) {
                this.advance()
                if (this.token.tokentype === TokenType.LBRACKET) {
                    this.advance()
                    access = this.expr()
                    if (this.token.tokentype !== TokenType.RBRACKET) {
                        throw {
                            msg: "Parser: ']' expected",
                            position: token.position
                        }
                    }
                    this.advance()
                }
                return new ListNode(token.position, list, access)
            } else {
                throw {
                    msg: "Parser: ']' expected",
                    position: token.position
                }
            }
        } else if (token.tokentype === TokenType.IDENTIFIER) { // Variable
            let access
            this.advance()
            if (this.token.tokentype === TokenType.ASSIGN) {
                this.advance()
                return new AssignNode(token.position, token.value, this.orexpr())
            } else if (this.token.tokentype === TokenType.LBRACKET) { // List access
                this.advance()
                access = this.expr()
                if (this.token.tokentype !== TokenType.RBRACKET) {
                    throw {
                        msg: "Parser: ']' expected",
                        position: token.position
                    }
                }
                this.advance()
            } else if (this.token.tokentype === TokenType.LPAREN) { // Function call
                this.advance()
                return this.handleFuncCall(token)
            }
            if (idOnly) {
                return new DeclareIdentifierNode(token.position, token.value, access)
            } else {
                return new IdentifierNode(token.position, token.value, access)
            }

        } else {
            throw {
                msg: "Parser: Number, Identifier, String, '[', '(', '+', or '-' expected",
                position: token.position
            }
        }
    }
    term() {
        let left = this.factor()
        while (this.token.tokentype === TokenType.MUL || this.token.tokentype === TokenType.DIV) {
            let op = this.token
            this.advance()
            let right = this.factor()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    expr() {
        let left = this.term()
        while (this.token.tokentype === TokenType.PLUS || this.token.tokentype === TokenType.MINUS) {
            let op = this.token
            this.advance()
            let right = this.term()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    glexpr() {
        let left = this.expr()
        while (this.token.tokentype === TokenType.LT || this.token.tokentype === TokenType.LE || this.token.tokentype === TokenType.GT || this.token.tokentype === TokenType.GE) {
            let op = this.token
            this.advance()
            let right = this.expr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    eqexpr() {
        let left = this.glexpr()
        while (this.token.tokentype === TokenType.EQ || this.token.tokentype === TokenType.NE) {
            let op = this.token
            this.advance()
            let right = this.glexpr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    andexpr() {
        let left = this.eqexpr()
        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "AND") {
            let op = this.token
            this.advance()
            let right = this.eqexpr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    orexpr() {
        let left = this.andexpr()
        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "OR") {
            let op = this.token
            this.advance()
            let right = this.andexpr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    statement() {
        const token = this.token
        let condition, elseprog = undefined, identifier, prog, args
        if (token.tokentype === TokenType.IDENTIFIER) { // Variable
            let access
            this.advance()
            if (this.token.tokentype === TokenType.ASSIGN) {
                this.advance()
                return new AssignNode(token.position, token.value, this.orexpr())
            } else if (this.token.tokentype === TokenType.LPAREN) { // Function call
                this.advance()
                return this.handleFuncCall(token)
            }
        } else if (this.token.tokentype === TokenType.KEYWORD) {
            switch (this.token.value) {
                case "IF":
                    this.advance()
                    condition = this.orexpr()
                    if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "THEN") {
                        this.advance()
                        const stmt = this.statement()
                        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "ELSE") {
                            this.advance()
                            return new IfNode(token.position, condition, stmt, this.statement())
                        } else {
                            return new IfNode(token.position, condition, stmt, undefined)
                        }
                    } else if (this.token.tokentype === TokenType.COLON) {
                        this.advance()
                        prog = this.program()
                        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "ELSE") {
                            this.advance()
                            elseprog = this.program()
                        }
                        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "ENDIF") {
                            this.advance()
                            if (elseprog !== undefined) {
                                return new IfNode(token.position, condition, prog, elseprog)
                            } else {
                                return new IfNode(token.position, condition, prog, undefined)
                            }
                        } else {
                            throw {
                                msg: "Parser: 'ENDIF' expected",
                                position: token.position
                            }
                        }
                    } else {
                        throw {
                            msg: "Parser: 'THEN' expected",
                            position: token.position
                        }
                    }
                    break
                case "WHILE":
                    this.advance()
                    condition = this.orexpr()
                    if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "DO") {
                        this.advance()
                        return new WhileNode(token.position, condition, this.statement())
                    } else if (this.token.tokentype === TokenType.COLON) {
                        this.advance()
                        const result = this.program()
                        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "ENDWHILE") {
                            this.advance()
                            return new WhileNode(token.position, condition, result)
                        } else {
                            throw {
                                msg: "Parser: 'ENDWHILE' expected",
                                position: token.position
                            }
                        }
                    } else {
                        throw {
                            msg: "Parser: 'DO' expected",
                            position: token.position
                        }
                    }
                    break
                case "NAMESPACE":
                    this.advance()
                    if (this.token.tokentype !== TokenType.IDENTIFIER) {
                        throw {
                            msg: "Parser: identifier expected",
                            position: token.position
                        }
                    }
                    identifier = this.token.value
                    this.advance()
                    prog = this.program()
                    if (this.token.tokentype !== TokenType.KEYWORD || this.token.value !== "ENDNAMESPACE") {
                        throw {
                            msg: "Parser: 'ENDNAMESPACE' expected",
                            position: token.position
                        }
                    }
                    this.advance()
                    return new NamespaceNode(token.position, identifier, prog)
                    break
                case "FUNCTION":
                    this.advance()
                    if (this.token.tokentype !== TokenType.IDENTIFIER) {
                        throw {
                            msg: "Parser: identifier expected",
                            position: token.position
                        }
                    }
                    identifier = this.token.value
                    this.advance()
                    if (this.token.tokentype !== TokenType.LPAREN) {
                        throw {
                            msg: "Parser: '(' expected",
                            position: token.position
                        }
                    }
                    this.advance()
                    if (this.token.tokentype === TokenType.RPAREN) {
                        this.advance()
                        prog = this.program()
                        if (this.token.tokentype !== TokenType.KEYWORD || this.token.value !== "ENDFUNCTION") {
                            throw {
                                msg: "Parser: 'ENDFUNCTION' expected",
                                position: token.position
                            }
                        }
                        this.advance()
                        return new FuncDefNode(token.position, identifier, prog, undefined)
                    }
                    args = this.getArgList(token, true)
                    if (this.token.tokentype !== TokenType.RPAREN) {
                        throw {
                            msg: "Parser: ')' expected",
                            position: token.position
                        }
                    }
                    this.advance()
                    prog = this.program()
                    if (this.token.tokentype !== TokenType.KEYWORD || this.token.value !== "ENDFUNCTION") {
                        throw {
                            msg: "Parser: 'ENDFUNCTION' expected",
                            position: token.position
                        }
                    }
                    this.advance()
                    return new FuncDefNode(token.position, identifier, prog, args)
                    break
                case "PRINT":
                case "PRINTLN":
                case "CPRINT":
                    const lf = this.token.value === "PRINTLN"
                    const con = this.token.value === "CPRINT"
                    this.advance()
                    if (this.token.tokentype === TokenType.COLON) {
                        if (lf) {
                            return new PrintLNNode(token.position, undefined)
                        } else {
                            return new PrintNode(token.position, undefined)
                        }
                    } else {
                        const args = this.getArgList(token)
                        if (lf) {
                            return new PrintLNNode(token.position, args)
                        } else if (con) {
                            return new CPrintNode(token.position, args)
                        } else {
                            return new PrintNode(token.position, args)
                        }
                    }
                    break
                case "DUMP":
                    this.advance()
                    return new DumpNode(token.position)
                    break
                case "CLS":
                    this.advance()
                    return new ClsNode(token.position)
                    break
                case "CDUMP":
                    this.advance()
                    return new CDumpNode(token.position)
                    break
                default:
            }//switch
        }//else if keyword
    }//fn
    program() {
        while (this.token.tokentype === TokenType.COLON) {
            this.advance()
        }
        let result = this.statement()
        while (this.token.tokentype === TokenType.COLON) {
            this.advance()
            const stmt = this.statement()
            result = new StatementNode(result.position, result, stmt)
        }
        return result
    }
    parse() {
        let result = this.program()
        if (this.token.tokentype !== TokenType.EOF) {
            throw {
                msg: `Parser: EOF expected (${this.token.tokentype}, ${this.token.value})`,
                position: this.token.position,
                details: this.tokens
            }
        }
        return result
    }
}
