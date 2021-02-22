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
    "LBRACKET": "LBRACKET",
    "RBRACKET": "RBRACKET",
    "ASSIGN": "ASSIGN",
    "COMMA": "COMMA",
    "COLON": "COLON",
    "DOT": "DOT",
    "EQ": "EQ",
    "NE": "NE",
    "LT": "LT",
    "LE": "LE",
    "GT": "GT",
    "GE": "GE",
    "VARIABLE": "VARIABLE",
    "KEYWORD": "KEYWORD"
}

const KEYWORDS = [
    "AND", "OR", "NOT",
    "IF", "THEN", "ELSE", "ENDIF",
    "DO",
    "FOR", "TO", "STEP", "NEXT",
    "WHILE", "ENDWHILE",
    "FUNCTION", "ENDFUNCTION",
    "CLS",
    "PRINT", "PRINTLN", "CPRINT",
    "DUMP", "CDUMP"
]

class Token {
    constructor(tokentype, value, position) {
        this.tokentype = tokentype
        this.value = value
        this.position = position
    }
}
