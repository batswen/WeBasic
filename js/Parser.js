class Parser {
    constructor(tokens) {
        this.tokens = tokens
        this.pos = -1
        this.token = undefined
        this.errorMsg = undefined
        this.advance()
    }
    error(msg, position, details = undefined) {
        this.errorMsg = {
            msg, position, details
        }
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
                this.error(`identifier expected (${this.token.tokentype})`, token.position)
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
                    this.error(`identifier expected (${this.token.tokentype})`, token.position)
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
            this.error(`')' expected (${this.token.tokentype})`, token.position)
        }
        this.advance()
        return new FuncCallNode(token.position, token.value, args)
    }
    factor(idOnly) {
        const token = this.token
        if (idOnly && token.tokentype !== TokenType.IDENTIFIER) {
            this.error(`identifier expected (${this.token.tokentype})`, token.position)
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
                this.error(`')' expected (${this.token.tokentype})`, token.position)
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
                    this.eat(TokenType.RBRACKET, token.position)
                }
                return new ListNode(token.position, list, access)
            } else {
                this.error(`']' expected (${this.token.tokentype})`, token.position)
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
                this.eat(TokenType.RBRACKET, token.position)
            } else if (this.token.tokentype === TokenType.LPAREN) { // Function call
                this.advance()
                return this.handleFuncCall(token)
            }
            if (idOnly) {
                return new DeclareIdentifierNode(token.position, token.value, access)
            } else {
                return new IdentifierNode(token.position, token.value, access)
            }

        } else if (this.token.tokentype === TokenType.KEYWORD) {
            switch (this.token.value) {
                case "RND":
                    this.eat(TokenType.KEYWORD, token.position)
                    this.eat(TokenType.LPAREN, token.position)
                    this.eat(TokenType.RPAREN, token.position)
                    return new RandomNode(token.posiiton)
                    break
            }
        } else {
            this.error(`Number, Identifier, String, '[', '(', '+', or '-' expected (${this.token.tokentype})`, token.position)
        }
    }
    eat(tokentype, pos, keyword = undefined) {
        if (this.token.tokentype === tokentype) {
            this.advance()
        } else {
            this.error(`${tokentype} expected, got ${this.token.tokentype}`, pos)
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
            } else {
                this.error(`'=', '(', or '[' expected (${this.token.tokentype})`, token.position)
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
                            this.error(`'ENDIF' expected (${this.token.tokentype})`, token.position)
                        }
                    } else {
                        this.error(`'THEN' expected (${this.token.tokentype})`, token.position)
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
                            this.error(`'ENDWHILE' expected (${this.token.tokentype})`, token.position)
                        }
                    } else {
                        this.error(`'DO' expected (${this.token.tokentype})`, token.position)
                    }
                    break
                case "NAMESPACE":
                    this.advance()
                    if (this.token.tokentype !== TokenType.IDENTIFIER) {
                        this.error(`identifier expected (${this.token.tokentype})`, token.position)
                    }
                    identifier = this.token.value
                    this.advance()
                    prog = this.program()
                    if (this.token.tokentype !== TokenType.KEYWORD || this.token.value !== "ENDNAMESPACE") {
                        this.error(`'ENDNAMESPACE' expected (${this.token.tokentype})`, token.position)
                    }
                    this.advance()
                    return new NamespaceNode(token.position, identifier, prog)
                    break
                case "FUNCTION":
                    this.advance()
                    if (this.token.tokentype !== TokenType.IDENTIFIER) {
                        this.error(`identifier expected (${this.token.tokentype})`, token.position)
                    }
                    identifier = this.token.value
                    this.advance()
                    if (this.token.tokentype !== TokenType.LPAREN) {
                        this.error(`'(' expected (${this.token.tokentype})`, token.position)
                    }
                    this.advance()
                    if (this.token.tokentype === TokenType.RPAREN) {
                        this.advance()
                        prog = this.program()
                        if (this.token.tokentype !== TokenType.KEYWORD || this.token.value !== "ENDFUNCTION") {
                            this.error(`'ENDFUNCTION' expected (${this.token.tokentype})`, token.position)
                        }
                        this.advance()
                        return new FuncDefNode(token.position, identifier, prog, undefined)
                    }
                    args = this.getArgList(token, true)
                    if (this.token.tokentype !== TokenType.RPAREN) {
                        this.error(`')' expected (${this.token.tokentype})`, token.position)
                    }
                    this.advance()
                    prog = this.program()
                    if (this.token.tokentype !== TokenType.KEYWORD || this.token.value !== "ENDFUNCTION") {
                        this.error(`'ENDFUNCTION' expected (${this.token.tokentype})`, token.position)
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
                case "RETURN":
                    this.advance()
                    if (this.token.tokentype === TokenType.COLON) {
                        return new ReturnNode(token.position, undefined)
                    } else {
                        return new ReturnNode(token.position, this.orexpr())
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
            while (this.token.tokentype === TokenType.COLON) {
                this.advance()
            }
            const stmt = this.statement()
            result = new StatementNode(result.position, result, stmt)
        }
        return result
    }
    parse() {
        let result = this.program()
        if (this.token.tokentype !== TokenType.EOF) {
            this.error(`EOF expected (${this.token.tokentype}, ${this.token.value})`,this.token.position,this.tokens)
        }
        return [result, this.errorMsg]
    }
}
