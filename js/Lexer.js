class Lexer {
    constructor(source) {
        this.source = source
        this.position = new Position(-1, 1, 0)
        this.char = undefined
        this.nextChar()
    }
    error(msg) {
        throw(`Lexer: ${msg}, on line: ${this.position.line}, column: ${this.position.col}`)
    }
    peekNextChar() {
        if (this.position.pos + 1 < this.source.length) {
            return this.source[this.position.pos + 1]
        } else {
            return undefined
        }
    }
    nextChar() {
        this.position.advance(this.char)
        if (this.position.pos < this.source.length) {
            this.char = this.source[this.position.pos]
        } else {
            this.char = undefined
        }
        return this.char
    }
    getVarOrKeyword() {
        let identifier = this.char
        while (this.nextChar() !== undefined && /[\$_0-9\p{L}]/u.test(this.char)) {
            identifier += this.char
        }

        if (KEYWORDS.indexOf(identifier.toUpperCase()) > -1) {
            return new Token(TokenType.KEYWORD, identifier.toUpperCase(), this.position)
        } else {
            return new Token(TokenType.VARIABLE, identifier, this.position)
        }
    }
    getTokOrTok(test, ifyes, ifnt) {
        if (this.peekNextChar() === test) {
            this.nextChar()
            return new Token(ifyes, null, this.position)
        } else {
            return new Token(ifnt, null, this.position)
        }
    }
    getString() {
        let result = ""
        while (this.nextChar() !== undefined && this.char !== '"') {
            result += this.char
        }
        return new Token(TokenType.STRING, result, this.position)
    }
    getNumber() {
        let number = this.char, dots = 0
        while (this.nextChar() !== undefined && /[0-9\.]/.test(this.char)) {
            number += this.char
            if (this.char === ".") {
                dots++
            }
        }
        if (dots === 0) {
            return new Token(TokenType.INT, parseInt(number), this.position)
        } else if (dots === 1) {
            return new Token(TokenType.FLOAT, parseFloat(number), this.position)
        } else {
            this.error("Not a number")
        }
    }
    makeTokens() {
        const tokens = []

        while (this.char !== undefined) {
            if (/ \t/.test(this.char)) {
                this.nextChar()
                continue
            }
            if (this.char === "+") {
                tokens.push(new Token(TokenType.PLUS, null, this.position))
                this.nextChar()
            } else if (this.char === "-") {
                tokens.push(new Token(TokenType.MINUS, null, this.position))
                this.nextChar()
            } else if (this.char === "*") {
                tokens.push(new Token(TokenType.MUL, null, this.position))
                this.nextChar()
            } else if (this.char === "/") {
                tokens.push(new Token(TokenType.DIV, null, this.position))
                this.nextChar()
            } else if (this.char === "(") {
                tokens.push(new Token(TokenType.LPAREN, null, this.position))
                this.nextChar()
            } else if (this.char === ")") {
                tokens.push(new Token(TokenType.RPAREN, null, this.position))
                this.nextChar()
            } else if (this.char === ",") {
                tokens.push(new Token(TokenType.COMMA, null, this.position))
                this.nextChar()
            } else if (this.char === ":" || this.char === "\n") {
                tokens.push(new Token(TokenType.COLON, null, this.position))
                this.nextChar()
            } else if (this.char === "<") {
                tokens.push(this.getTokOrTok("=", TokenType.LE, TokenType.LT))
                this.nextChar()
            } else if (this.char === ">") {
                tokens.push(this.getTokOrTok("=", TokenType.GE, TokenType.GT))
                this.nextChar()
            } else if (this.char === "=") {
                tokens.push(this.getTokOrTok("=", TokenType.EQ, TokenType.ASSIGN))
                this.nextChar()
            } else if (this.char === '"') {
                tokens.push(this.getString())
                this.nextChar()
            } else if (/[a-zA-Z_\$]/.test(this.char)) {
                tokens.push(this.getVarOrKeyword())
            } else if (/[0-9]/.test(this.char)) {
                tokens.push(this.getNumber())
            } else {
                this.error(`Unknown character: '${this.char}'`)
            }
        }

        tokens.push(new Token(TokenType.EOF, null, this.position))
        return tokens
    }
}
