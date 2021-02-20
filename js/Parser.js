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
                throw "Parser: ')' expected"+this.token.position
            }
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
    parse() {
        let result = this.expr()
        if (this.token.tokentype !== TokenType.EOF) {
            throw "Parser: EOF expected"
        }
        return result
    }
}
