class Lexer {
    constructor(source) {
        this.source = source
        this.position = new Position(-1, 1, 0)
        this.char = undefined
        this.nextChar()
    }
    error(msg) {
        alert(`Lexer: ${msg}, on line: ${this.line}, column: ${this.col}`)
        throw 1
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
            if (/\s/.test(this.char)) {
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
            } else if (this.char === '"') {
                tokens.push(this.getString())
                this.nextChar()
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
