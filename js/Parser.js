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
    factor() {
        const token = this.token
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
            let expr = this.expr()
            if (this.token.tokentype === TokenType.RPAREN) {
                this.advance()
                return expr
            } else {
                throw {
                    msg: "Parser: ')' expected",
                    position: token.position
                }
            }
        } else if (token.tokentype === TokenType.VARIABLE) {
            this.advance()
            return new VariableNode(token.position, token.value)
        } else {
            throw {
                msg: "Parser: Number, '(', '+', or '-' expected",
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
        let condition, elseprog = undefined
        if (this.token.tokentype === TokenType.VARIABLE) {
            this.advance()
            if (this.token.tokentype === TokenType.ASSIGN) {
                this.advance()
                return new AssignNode(token.position, token.value, this.orexpr())
            } else {
                throw {
                    msg: "Parser: '=' expected",
                    position: token.position,
                    details: token
                }
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
                            return new IfElseNode(token.position, condition, stmt, this.statement())
                        } else {
                            return new IfNode(token.position, condition, stmt)
                        }
                    } else if (this.token.tokentype === TokenType.COLON) {
                        this.advance()
                        const prog = this.program()
                        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "ELSE") {
                            this.advance()
                            elseprog = this.program()
                        }
                        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "ENDIF") {
                            this.advance()
                            if (elseprog !== undefined) {
                                return new IfElseNode(token.position, condition, prog, elseprog)
                            } else {
                                return new IfNode(token.position, condition, prog)
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
                        result = this.program()
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
                case "PRINT":
                    this.advance()
                    return new PrintNode(token.position, this.orexpr())
                    break
                case "DUMP":
                    this.advance()
                    return new DumpNode(token.position)
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
