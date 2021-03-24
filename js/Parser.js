class Parser {
    constructor(tokens) {
        this.tokens = tokens
        this.pos = -1
        this.token = undefined
        this.errorMsg = undefined
        this.advance()
    }
    error(msg, position) {
        this.errorMsg = {
            msg, position
        }
        throw "error"
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
    eat(tokentype, pos) {
        if (this.token.tokentype === tokentype) {
            if (tokentype === TokenType.COLON) {
                while (this.token.tokentype === TokenType.COLON) {
                    this.advance()
                }
            } else {
                this.advance()
            }
        } else {
            this.error(`${tokentype} expected, got ${this.token.tokentype} ${this.token.value}`, pos)
        }
    }
    eatTokenTypes(tokentypes, pos) {
        if (tokentypes.indexOf(this.token.tokentype) > -1) {
                this.advance()
        } else {
            this.error(`${tokentypes} expected, got ${this.token.tokentype} ${this.token.value}`, pos)
        }
    }
    eatKeyword(keyword, pos) {
        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === keyword) {
            this.advance()
        } else {
            this.error(`${keyword} expected, got ${this.token.value}`, pos)
        }
    }
    eatKeywords(keywords, pos) {
        if (this.token.tokentype === TokenType.KEYWORD && keywords.indexOf(this.token.value) > -1) {
            this.advance()
        } else {
            this.error(`${keywords} expected, got ${this.token.value}`, pos)
        }
    }
    getArgList(token) {
        return this.getNumArgList(token, 1000000)
    }
    getNumArgList(token, amount) {
        const args = []
        let count = 1
        args.push(this.orexpr())
        while (count < amount && this.token.tokentype === TokenType.COMMA) {
            this.eat(TokenType.COMMA, token.position)
            count++
            args.push(this.orexpr())
        }
        return args
    }
    getIdentifierList(token) {
        const args = []
        args.push(this.factor(true))
        while (this.token.tokentype === TokenType.COMMA) {
            this.eat(TokenType.COMMA, token.position)
            args.push(this.factor(true))
        }
        return args
    }
    // getTypedArgList(token, types) {
    //     const args = []
    //     let count = 0
    //     if ((types[count] === TokenType.NUMBER && this.token.tokentype === TokenType.INT || this.token.tokentype === TokenType.FLOAT) || this.token.tokentype === types[count]) {
    //         count++
    //         args.push(this.orexpr())
    //     } else {
    //         this.error(`Arg expected ${types[count]}, got ${this.token.tokentype}`, token.position)
    //     }
    //     while (count < types.length && this.token.tokentype === TokenType.COMMA) {
    //         this.eat(TokenType.COMMA, this.token.position)
    //         if ((types[count] === TokenType.NUMBER && this.token.tokentype === TokenType.INT || this.token.tokentype === TokenType.FLOAT) || this.token.tokentype === types[count]) {
    //             count++
    //             args.push(this.orexpr())
    //         } else {
    //             this.error(`Arg expected ${types[count]}, got ${this.token.tokentype}`, token.position)
    //         }
    //     }
    //     return args
    // }
    handleFuncCall(token) {
        // args
        let args = undefined
        this.eat(TokenType.LPAREN, this.token.position)
        if (this.token.tokentype !== TokenType.RPAREN) {
            args = this.getArgList(token)
        }
        this.eat(TokenType.RPAREN, this.token.position)
        return new FuncCallNode(token.position, token.value, args)
    }
    factor(idOnly) {
        const token = this.token
        let args
        if (idOnly && token.tokentype !== TokenType.IDENTIFIER) {
            this.error(`Identifier expected (${this.token.tokentype})`, token.position)
        }
        if (token.tokentype === TokenType.STRING) {
            this.eat(TokenType.STRING, token.position)
            return new StringNode(token.position, token.value)
        } else if (token.tokentype === TokenType.INT || token.tokentype === TokenType.FLOAT) {
            this.eatTokenTypes(["INT", "FLOAT"], token.position)
            if (token.tokentype === TokenType.INT) {
                return new IntNode(token.position, token.value)
            } else {
                return new FloatNode(token.position, token.value)
            }
        } else if (token.tokentype === TokenType.PLUS || token.tokentype === TokenType.MINUS) {
            this.eatTokenTypes(["PLUS", "MINUS"], token.position)
            return new UnOpNode(token.position, this.factor(), token)
        } else if (token.tokentype === TokenType.KEYWORD && token.value === "NOT") {
            this.eatKeyword("NOT", this.token.position)
            return new UnOpNode(token.position, this.orexpr(), token)
        } else if (token.tokentype === TokenType.LPAREN) {
            this.eat(TokenType.LPAREN, token.position)
            let expr = this.orexpr()
            this.eat(TokenType.RPAREN, this.token.position)
            return expr
        } else if (token.tokentype === TokenType.LBRACKET) {
            this.eat(TokenType.LBRACKET, token.position)
            let list = [], access = undefined
            if (this.token.tokentype !== TokenType.RBRACKET) {
                list.push(this.orexpr())
                while (this.token.tokentype === TokenType.COMMA) {
                    this.eat(TokenType.COMMA, this.token.position)
                    list.push(this.orexpr())
                }
            }
            this.eat(TokenType.RBRACKET, token.position)
            if (this.token.tokentype === TokenType.LBRACKET) {
                this.eat(TokenType.LBRACKET, this.token.position)
                access = this.expr()
                this.eat(TokenType.RBRACKET, this.token.position)
            }
            return new ListNode(token.position, list, access)
        } else if (token.tokentype === TokenType.IDENTIFIER) { // Variable
            let access = undefined
            this.eat(TokenType.IDENTIFIER, token.position)
            if (this.token.tokentype === TokenType.ASSIGN) {
                this.eat(TokenType.ASSIGN, token.position)
                return new AssignNode(token.position, token.value, this.orexpr(), null)
            } else if (this.token.tokentype === TokenType.LPAREN) { // Function call
                return this.handleFuncCall(token)
            } else if (this.token.tokentype === TokenType.LBRACKET) { // List access
                this.eat(TokenType.LBRACKET, token.position)
                access = this.expr()
                this.eat(TokenType.RBRACKET, token.position)
            }
            if (idOnly) {
                return new DeclareIdentifierNode(token.position, token.value, access)
            } else {
                return new IdentifierNode(token.position, token.value, access)
            }
        } else if (token.tokentype === TokenType.KEYWORD) {
            switch (this.token.value) {
                case "RND":
                    this.eatKeyword("RND", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new RandomNode(token.position)
                    break
                case "LEFT":
                    this.eatKeyword("LEFT", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 2)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new LeftNode(token.position, args[0], args[1])
                    break
                case "RIGHT":
                    this.eatKeyword("RIGHT", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 2)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new RightNode(token.position, args[0], args[1])
                    break
                case "MID":
                    this.eatKeyword("MID", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 3)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new MidNode(token.position, args[0], args[1], args[2])
                    break
                case "INT":
                    this.eatKeyword("INT", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new IntConvNode(token.position, args[0])
                    break
                case "FLOAT":
                    this.eatKeyword("FLOAT", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new FloatConvNode(token.position, args[0])
                    break
                case "STRING":
                    this.eatKeyword("STRING", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new StringConvNode(token.position, args[0])
                    break
                case "ISINT":
                    this.eatKeyword("ISINT", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new IntTestNode(token.position, args[0])
                    break
                case "ISFLOAT":
                    this.eatKeyword("ISFLOAT", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new FloatTestNode(token.position, args[0])
                    break
                case "ISSTRING":
                    this.eatKeyword("ISSTRING", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new StringTestNode(token.position, args[0])
                    break
                case "DATE":
                    this.eatKeyword("DATE", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new DateNode(token.position)
                    break
                case "TIME":
                    this.eatKeyword("TIME", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new TimeNode(token.position)
                    break
                case "LEN":
                    this.eatKeyword("LEN", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new LenNode(token.position, args[0])
                    break
                case "INPUT":
                    this.eatKeyword("INPUT", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new InputNode(token.position, args[0])
                    break
                case "SQRT":
                    this.eatKeyword("SQRT", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new SqrtNode(token.position, args[0])
                    break
                case "ABS":
                    this.eatKeyword("ABS", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new AbsNode(token.position, args[0])
                    break
                case "SIN":
                    this.eatKeyword("SIN", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new SinNode(token.position, args[0])
                    break
                case "COS":
                    this.eatKeyword("COS", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new CosNode(token.position, args[0])
                    break
                case "TAN":
                    this.eatKeyword("TAN", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new TanNode(token.position, args[0])
                    break
                case "ROUND":
                    this.eatKeyword("ROUND", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new RoundNode(token.position, args[0])
                    break
                case "FLOOR":
                    this.eatKeyword("FLOOR", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new FloorNode(token.position, args[0])
                    break
                case "CEIL":
                    this.eatKeyword("CEIL", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new CeilNode(token.position, args[0])
                    break
                case "LOG":
                    this.eatKeyword("LOG", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new LogNode(token.position, args[0])
                    break
                case "EXP":
                    this.eatKeyword("EXP", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new ExpNode(token.position, args[0])
                    break
                case "POWER":
                    this.eatKeyword("POWER", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 2)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new PowerNode(token.position, args[0], args[1])
                    break
                case "SIGN":
                    this.eatKeyword("SIGN", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new SignNode(token.position, args[0])
                    break
                case "ASC":
                    this.eatKeyword("ASC", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new AscNode(token.position, args[0])
                    break
                case "CHAR":
                    this.eatKeyword("CHAR", token.position)
                    this.eat(TokenType.LPAREN, this.token.position)
                    args = this.getNumArgList(token, 1)
                    this.eat(TokenType.RPAREN, this.token.position)
                    return new CharNode(token.position, args[0])
                    break
            }
        } else {
            this.error(`Number, Identifier, String, '[', '(', '+', or '-' expected (${this.token.tokentype})`, token.position)
        }
    }
    term() {
        let left = this.factor()
        while (this.token.tokentype === TokenType.MUL || this.token.tokentype === TokenType.DIV || this.token.tokentype === TokenType.MOD) {
            let op = this.token
            this.eatTokenTypes(["MUL", "DIV", "MOD"], this.token.position)
            let right = this.factor()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    expr() {
        let left = this.term()
        while (this.token.tokentype === TokenType.PLUS || this.token.tokentype === TokenType.MINUS) {
            let op = this.token
            this.eatTokenTypes(["PLUS", "MINUS"], this.token.position)
            let right = this.term()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    glexpr() {
        let left = this.expr()
        while (this.token.tokentype === TokenType.LT || this.token.tokentype === TokenType.LE || this.token.tokentype === TokenType.GT || this.token.tokentype === TokenType.GE) {
            let op = this.token
            this.eatTokenTypes(["LT", "LE", "GT", "GE"], this.token.position)
            let right = this.expr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    eqexpr() {
        let left = this.glexpr()
        while (this.token.tokentype === TokenType.EQ || this.token.tokentype === TokenType.NE) {
            let op = this.token
            this.eatTokenTypes(["EQ", "NE"], this.token.position)
            let right = this.glexpr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    andexpr() {
        let left = this.eqexpr()
        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "AND") {
            let op = this.token
            this.eatKeyword("AND", this.token.position)
            let right = this.eqexpr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    orexpr() {
        let left = this.andexpr()
        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "OR") {
            let op = this.token
            this.eatKeyword("OR", this.token.position)
            let right = this.andexpr()
            left = new BinOpNode(this.token.position, left, op, right)
        }
        return left
    }
    statement() {
        const token = this.token
        let condition, elseprog = undefined, identifier, prog, args, stmt, access, retvalue
        if (token.tokentype === TokenType.IDENTIFIER) { // Variable
            this.eat(TokenType.IDENTIFIER, token.position)
            if (this.token.tokentype === TokenType.ASSIGN) {
                this.eat(TokenType.ASSIGN, token.position)
                return new AssignNode(token.position, token.value, this.orexpr(), null)
            } else if (this.token.tokentype === TokenType.LPAREN) { // Function call
                return this.handleFuncCall(token)
            } else if (this.token.tokentype === TokenType.LBRACKET) { // List access
                // access = []
                // while (this.token.tokentype === TokenType.LBRACKET) {
                //     this.eat(TokenType.LBRACKET, token.position)
                //     access.push(this.expr())
                //     this.eat(TokenType.RBRACKET, token.position)
                // }

                this.eat(TokenType.LBRACKET, token.position)
                access = this.expr()
                this.eat(TokenType.RBRACKET, token.position)
                this.eat(TokenType.ASSIGN, token.position)
                return new AssignNode(token.position, token.value, this.orexpr(), access)
            } else {
                this.error(`'=', '(', or '[' expected (${token.tokentype})`, token.position)
            }
        } else if (token.tokentype === TokenType.KEYWORD) {
            switch (token.value) {
                case "IF":
                    this.eatKeyword("IF", token.position)
                    condition = this.orexpr()
                    if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "THEN") {
                        this.eatKeyword("THEN", token.position)
                        stmt = this.statement()
                        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "ELSE") {
                            this.eatKeyword("ELSE", token.position)
                            return new IfNode(token.position, condition, stmt, this.statement())
                        } else {
                            return new IfNode(token.position, condition, stmt, undefined)
                        }
                    } else if (this.token.tokentype === TokenType.COLON) {
                        this.eat(TokenType.COLON, token.position)
                        prog = this.program()
                        if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "ELSE") {
                            this.eatKeyword("ELSE", token.position)
                            elseprog = this.program()
                        }
                        this.eatKeyword("ENDIF", token.position)
                        if (elseprog !== undefined) {
                            return new IfNode(token.position, condition, prog, elseprog)
                        } else {
                            return new IfNode(token.position, condition, prog, undefined)
                        }

                    } else {
                        this.error(`'THEN' expected (${this.token.tokentype})`, token.position)
                    }
                    break
                case "FOR":
                    this.eatKeyword("FOR", token.position)
                    const forIdentifier = new DeclareIfUndeclaredIdentifierNode(this.token.position, this.token.value)
                    this.eat(TokenType.IDENTIFIER, token.position)
                    let forStep
                    this.eat(TokenType.ASSIGN, token.position)
                    const forStart = this.expr()
                    this.eatKeyword("TO", token.position)
                    const forEnd = this.expr()
                    if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "STEP") {
                        this.eatKeyword("STEP", token.position)
                        forStep = this.expr()
                    } else {
                        forStep = new FloatNode(null, 1)
                    }
                    if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "DO") {
                        this.eatKeyword("DO", token.position)
                        stmt = this.statement()
                        return new ForNode(token.position, forIdentifier, forStart, forEnd, forStep, stmt)
                    } else {
                        this.eat(TokenType.COLON, token.position)
                        prog = this.program()
                        this.eatKeyword("NEXT", token.position)
                        return new ForNode(token.position, forIdentifier, forStart, forEnd, forStep, prog)
                    }
                    break
                case "WHILE":
                    this.eatKeyword("WHILE", token.position)
                    condition = this.orexpr()
                    if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "DO") {
                        this.eatKeyword("DO", token.position)
                        return new WhileNode(token.position, condition, this.statement())
                    } else if (this.token.tokentype === TokenType.COLON) {
                        this.eat(TokenType.COLON, token.position)
                        const result = this.program()
                        this.eatKeyword("ENDWHILE", token.position)
                        return new WhileNode(token.position, condition, result)
                    } else {
                        this.error(`'DO' expected (${this.token.tokentype})`, token.position)
                    }
                    break
                case "NAMESPACE":
                    this.eatKeyword("NAMESPACE", token.position)
                    identifier = this.token.value
                    this.eat(TokenType.IDENTIFIER, this.token.position)
                    prog = this.program()
                    this.eatKeyword("ENDNAMESPACE", token.position)
                    return new NamespaceNode(token.position, identifier, prog)
                    break
                case "FUNCTION":
                    this.eatKeyword("FUNCTION", token.position)
                    args = undefined
                    identifier = this.token.value
                    this.eat(TokenType.IDENTIFIER, this.token.position)
                    this.eat(TokenType.LPAREN, token.position)
                    if (this.token.tokentype !== TokenType.RPAREN) {
                        args = this.getIdentifierList(token)
                    }
                    this.eat(TokenType.RPAREN, token.position)
                    prog = this.program()
                    retvalue = undefined
                    if (this.token.tokentype === TokenType.KEYWORD && this.token.value === "RETURN") {
                        this.eatKeyword("RETURN", token.position)
                        retvalue = this.orexpr()
                        this.eat(TokenType.COLON, token.position)
                    }
                    this.eatKeyword("ENDFUNCTION", token.position)
                    return new FuncDefNode(token.position, identifier, prog, args, retvalue)
                    break
                case "PRINT":
                case "PRINTLN":
                case "CPRINT":
                    const lf = this.token.value === "PRINTLN"
                    const con = this.token.value === "CPRINT"
                    this.eatKeywords(["PRINT", "PRINTLN", "CPRINT"], token.position)
                    if (this.token.tokentype === TokenType.COLON) {
                        if (lf) {
                            return new PrintLNNode(token.position, undefined)
                        } else {
                            return new PrintNode(token.position, undefined)
                        }
                    } else {
                        const args = this.getArgList(token)
                        if (lf) {
                            return new PrintLNNode(token.position, args)
                        } else if (con) {
                            return new CPrintNode(token.position, args)
                        } else {
                            return new PrintNode(token.position, args)
                        }
                    }
                    break
                case "STROKECOLOR":
                    this.eatKeyword("STROKECOLOR", token.position)
                    args = this.getNumArgList(token, 3)
                    return new ColorNode(token.position, args)
                    break
                case "FILLCOLOR":
                    this.eatKeyword("FILLCOLOR", token.position)
                    args = this.getNumArgList(token, 3)
                    return new FillColorNode(token.position, args)
                    break
                case "POINT":
                    this.eatKeyword("POINT", token.position)
                    args = this.getNumArgList(token, 2)
                    return new PointNode(token.position, args)
                    break
                case "LINEWIDTH":
                    this.eatKeyword("LINEWIDTH", token.position)
                    args = this.getNumArgList(token, 1)
                    return new LineWidthNode(token.position, args)
                    break
                case "LINE":
                    this.eatKeyword("LINE", token.position)
                    args = this.getNumArgList(token, 4)
                    return new LineNode(token.position, args)
                    break
                case "RECT":
                    this.eatKeyword("RECT", token.position)
                    args = this.getNumArgList(token, 5)
                    return new RectNode(token.position, args)
                    break
                // case "RETURN":
                //     this.eatKeyword("RETURN", token.position)
                //     if (this.token.tokentype === TokenType.COLON) {
                //         return new ReturnNode(token.position, undefined)
                //     } else {
                //         return new ReturnNode(token.position, this.orexpr())
                //     }
                //     break
                case "DUMP":
                    this.eatKeyword("DUMP", token.position)
                    return new DumpNode(token.position)
                    break
                case "CLS":
                    this.eatKeyword("CLS", token.position)
                    return new ClsNode(token.position)
                    break
                case "CDUMP":
                    this.eatKeyword("CDUMP", token.position)
                    return new CDumpNode(token.position)
                    break
                case "CLEAR":
                    this.eatKeyword("CLEAR", token.position)
                    return new ClearNode(token.position)
                    break
                case "VAR":
                    this.eatKeyword("VAR", token.position)
                    return new DeclareIdentifierNode(token.position, this.getIdentifierList(token))
                default:
            }//switch
        }//else if keyword
    }//fn
    program() {
        while (this.token.tokentype === TokenType.COLON) {
            this.eat(TokenType.COLON, this.token.position)
        }
        let result = this.statement()
        while (this.token.tokentype === TokenType.COLON) {
            while (this.token.tokentype === TokenType.COLON) {
                this.eat(TokenType.COLON, this.token.position)
            }
            const stmt = this.statement()
            result = new StatementNode(result.position, result, stmt)
        }
        return result
    }
    parse() {
        let result = undefined
        try {
            result = this.program()
            if (this.token.tokentype !== TokenType.EOF) {
                this.error(`EOF expected (${this.token.tokentype}, ${this.token.value})`,this.token.position)
            }
        } catch (e) {
            if (e !== "error") {
                console.log(e)
            }
        }
        return [result, this.errorMsg]
    }
}
