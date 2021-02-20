const TokenType = {
    "EOF": "EOF",
    "INT": "INT",
    "FLOAT": "FLOAT",
    "STRING": "STRING",
    "PLUS": "PLUS",
    "MINUS": "MINUS",
    "MUL": "MUL",
    "DIV": "DIV",
    "LPAREN": "LPAREN",
    "RPAREN": "RPAREN"
}

class Token {
    constructor(tokentype, value, position) {
        this.tokentype = tokentype
        this.value = value
        this.position = position
    }
}
