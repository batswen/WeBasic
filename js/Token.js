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
    "NOT": "NOT",
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
    "CLS", "CLEAR",
    "PRINT", "PRINTLN", "CPRINT",
    "STROKECOLOR", "FILLCOLOR", "POINT", "LINE", "RECT", "LINEWIDTH",
    "DUMP", "CDUMP",
    "RND",
    "LEFT", "RIGHT", "MID",
    "INT", "FLOAT", "STRING",
    "ISINT", "ISFLOAT", "ISSTRING",
    "LEN", "ASC", "CHAR",
    "SQRT", "ABS", "SIN", "COS", "TAN", "ROUND", "CEIL", "FLOOR",
    "LOG", "EXP", "POWER", "SIGN",
    "INPUT",
    "DATE", "TIME"
]

class Token {
    constructor(tokentype, value, position) {
        this.tokentype = tokentype
        this.value = value
        this.position = position
    }
}
