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
    "RPAREN": "RPAREN",
    "ASSIGN": "ASSIGN",
    "EQ": "EQ",
    "NE": "NE",
    "LT": "LT",
    "LE": "LE",
    "GT": "GT",
    "GE": "GE",
    "AND": "AND",
    "OR": "OR",
    "NOT": "NOT",
    "VARIABLE": "VARIABLE",
    "FOR": "FOR",
    "TO": "TO",
    "STEP": "STEP",
    "NEXT": "NEXT",
    "DO": "DO",
    "WHILE": "WHILE"
}

class Token {
    constructor(tokentype, value, position) {
        this.tokentype = tokentype
        this.value = value
        this.position = position
        //console.log(tokentype, value, position)
    }
}
