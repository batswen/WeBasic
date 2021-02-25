class Lexer {
    constructor(source) {
        this.source = source
        this.position = new Position(-1, 1, 0)
        this.char = undefined
        this.errorMsg = undefined
        this.nextChar()
    }
    error(msg) {
        this.errorMsg = {
            msg,
            position: this.position
        }
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
    getVarOrKeyword(position) {
        let identifier = this.char
        while (this.nextChar() !== undefined && /[\$_0-9\p{L}]/u.test(this.char)) {
            identifier += this.char
        }

        if (KEYWORDS.indexOf(identifier.toUpperCase()) > -1) {
            return new Token(TokenType.KEYWORD, identifier.toUpperCase(), position.copy())
        } else {
            return new Token(TokenType.IDENTIFIER, identifier, position.copy())
        }
    }
    getTokOrTok(test, ifyes, ifnt, position) {
        if (this.peekNextChar() === test) {
            this.nextChar()
            return new Token(ifyes, null, position.copy())
        } else {
            return new Token(ifnt, null, position.copy())
        }
    }
    getString(position) {
        let result = "", currentChar
        while (this.nextChar() !== undefined && this.char !== '"' && this.char !== "\n") {
            if (this.char === "\\" && this.peekNextChar() !== undefined) {
                switch (this.nextChar()) {
                    case "n":
                        this.char = "\n"
                        break
                    case "\\":
                        this.char = "\\"
                        break
                    case "q":
                        this.char = '"'
                        break
                    case "a":
                        this.char = "'"
                        break
                }
            }
            result += this.char
        }
        if (this.char !== '"') {
            this.error(`" expected`)
        }
        return new Token(TokenType.STRING, result, position.copy())
    }
    getNumber(position) {
        let number = this.char, dots = 0
        while (this.nextChar() !== undefined && /[0-9\.]/.test(this.char)) {
            number += this.char
            if (this.char === ".") {
                dots++
            }
        }
        if (dots === 0) {
            return new Token(TokenType.INT, parseInt(number), position.copy())
        } else if (dots === 1) {
            return new Token(TokenType.FLOAT, parseFloat(number), position.copy())
        } else {
            this.error("Not a number")
        }
    }
    eatComment() {
        while (this.nextChar() !== undefined && this.char !== "\n") {
        }
    }
    makeTokens() {
        const tokens = []

        while (this.char !== undefined && this.errorMsg === undefined) {
            if (/[ \t]/.test(this.char)) {
                this.nextChar()
                continue
            }
            if (this.char === "+") {
                tokens.push(new Token(TokenType.PLUS, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === "-") {
                tokens.push(new Token(TokenType.MINUS, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === ";" || this.char === "#") {
                this.eatComment()
                this.nextChar()
            } else if (this.char === "*") {
                tokens.push(new Token(TokenType.MUL, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === "/") {
                tokens.push(new Token(TokenType.DIV, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === "%") {
                tokens.push(new Token(TokenType.MOD, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === "(") {
                tokens.push(new Token(TokenType.LPAREN, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === ")") {
                tokens.push(new Token(TokenType.RPAREN, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === "[") {
               tokens.push(new Token(TokenType.LBRACKET, null, this.position.copy()))
               this.nextChar()
            } else if (this.char === "]") {
               tokens.push(new Token(TokenType.RBRACKET, null, this.position.copy()))
               this.nextChar()
            } else if (this.char === ",") {
                tokens.push(new Token(TokenType.COMMA, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === ".") {
                tokens.push(new Token(TokenType.DOT, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === ":" || this.char === "\n") {
                tokens.push(new Token(TokenType.COLON, null, this.position.copy()))
                this.nextChar()
            } else if (this.char === "<") {
                tokens.push(this.getTokOrTok("=", TokenType.LE, TokenType.LT, this.position.copy()))
                this.nextChar()
            } else if (this.char === ">") {
                tokens.push(this.getTokOrTok("=", TokenType.GE, TokenType.GT, this.position.copy()))
                this.nextChar()
            } else if (this.char === "!" && this.peekNextChar() === "=") {
                tokens.push(new Token(TokenType.NE, null, this.position.copy()))
                this.nextChar()
                this.nextChar()
            } else if (this.char === "=") {
                tokens.push(this.getTokOrTok("=", TokenType.EQ, TokenType.ASSIGN, this.position.copy()))
                this.nextChar()
            } else if (this.char === '"') {
                tokens.push(this.getString(this.position.copy()))
                this.nextChar()
            } else if (/[a-zA-Z_\$]/.test(this.char)) {
                tokens.push(this.getVarOrKeyword(this.position.copy()))
            } else if (/[0-9]/.test(this.char)) {
                tokens.push(this.getNumber(this.position.copy()))
            } else {
                this.error(`Unknown character: '${this.char}'`)
            }
        }

        tokens.push(new Token(TokenType.EOF, null, this.position.copy()))
        return [tokens, this.errorMsg]
    }
}
