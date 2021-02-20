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
                throw "Parser: ')' expected"
            }
        } else if (token.tokentype === TokenType.VARIABLE) {
            this.advance()
            return new VariableNode(token.position, token.value)
        } else {
            throw "Parser: Number, '(', '+', or '-' expected"
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
        if (this.token.tokentype === TokenType.AND) {
            let op = this.token
            this.advance()
            let right = this.eqexpr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    orexpr() {
        let left = this.andexpr()
        if (this.token.tokentype === TokenType.OR) {
            let op = this.token
            this.advance()
            let right = this.andexpr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    statement() {
        const token = this.token
        let result = undefined
        if (this.token.tokentype === TokenType.VARIABLE) {
            this.advance()
            if (this.token.tokentype === TokenType.ASSIGN) {
                this.advance()
                result = new AssignNode(token.position, token.value, this.orexpr())
            } else {
                result = new VariableNode(token.position, token)
            }
        }
        return result
    }
    program() {
        let left = this.statement()
        while (this.token.tokentype === TokenType.COLON) {
            this.advance()
            if (this.token.tokentype !== TokenType.EOF && this.token.tokentype !== TokenType.COLON) {
                left = new StatementNode(left.position, left, this.statement())
            } else {
                left = new UnStatementNode(left.position, left)
            }
        }
        return left
    }
    parse() {
        let result = this.program()
        if (this.token.tokentype !== TokenType.EOF) {
            console.log("Parser: EOF expected"+this.token.tokentype)
        }
        return result
    }
}
