class Lexer {
    constructor(source) {
        this.source = source
        this.pos = -1
        this.line = 1
        this.col = 0
        this.char = ""
        this.nextChar()
    }
    error(msg) {
        alert(`Lexer: ${msg}, on line: ${this.line}, column: ${this.col}`)
        throw 1
    }
    nextChar() {
        if (this.pos < this.source.length) {
            this.pos++
            this.col++
            this.char = this.source[this.pos]
        } else {
            this.char = undefined
        }
        if (this.char === "\n") {
            this.line++
            this.col = 0
        }
        return this.char
    }
    getString() {
        let result = ""
        while (this.nextChar() !== undefined && this.char !== '"') {
            result += this.char
        }
        return new Token(TokenType.STRING, result, new Position(this.line, this.col))
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
            return new Token(TokenType.INT, parseInt(number), new Position(this.line, this.col))
        } else if (dots === 1) {
            return new Token(TokenType.FLOAT, parseFloat(number), new Position(this.line, this.col))
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
                tokens.push(new Token(TokenType.PLUS, null, new Position(this.line, this.col)))
                this.nextChar()
            } else if (this.char === "-") {
                tokens.push(new Token(TokenType.MINUS, null, new Position(this.line, this.col)))
                this.nextChar()
            } else if (this.char === "*") {
                tokens.push(new Token(TokenType.MUL, null, new Position(this.line, this.col)))
                this.nextChar()
            } else if (this.char === "/") {
                tokens.push(new Token(TokenType.DIV, null, new Position(this.line, this.col)))
                this.nextChar()
            } else if (this.char === "(") {
                tokens.push(new Token(TokenType.LPAREN, null, new Position(this.line, this.col)))
                this.nextChar()
            } else if (this.char === ")") {
                tokens.push(new Token(TokenType.RPAREN, null, new Position(this.line, this.col)))
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

        tokens.push(new Token(TokenType.EOF, null, new Position(this.line, this.col)))
        return tokens
    }
}
