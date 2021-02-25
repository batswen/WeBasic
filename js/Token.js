const TokenType = {
    "EOF": "EOF",
    "INT": "INT",
    "FLOAT": "FLOAT",
    "NUMBER": "NUMBER",
    "STRING": "STRING",
    "PLUS": "PLUS",
    "MINUS": "MINUS",
    "MUL": "MUL",
    "DIV": "DIV",
    "MOD": "MOD",
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
    "IDENTIFIER": "IDENTIFIER",
    "KEYWORD": "KEYWORD"
}

const KEYWORDS = [
    "VAR",
    "AND", "OR", "NOT",
    "IF", "THEN", "ELSE", "ENDIF",
    "DO",
    "FOR", "TO", "STEP", "NEXT",
    "WHILE", "ENDWHILE",
    "FUNCTION", "ENDFUNCTION", "RETURN",
    "NAMESPACE", "ENDNAMESPACE",
    "CLS",
    "PRINT", "PRINTLN", "CPRINT",
    "COLOR", "POINT", "LINE",
    "DUMP", "CDUMP",
    "RND",
    "LEFT",
    "INT", "FLOAT", "STRING",
    "ISINT", "ISFLOAT", "ISSTRING"
]

class Token {
    constructor(tokentype, value, position) {
        this.tokentype = tokentype
        this.value = value
        this.position = position
    }
}
