// const lex = require("./Lexer")
import Lexer from "../js/Lexer.js"
import Token, { TokenType } from "../js/Token.js"

let tokens

beforeEach(() => { tokens = new Lexer("cls:print").makeTokens() })

describe("Lexer", function() {
    it("gets length wrong", function() {
        // console.log(tokens[0])
        expect(tokens[0].length).toBe(4)
    })
    it("can't tokenize CLS", () => {
        expect(tokens[0][0].tokentype).toBe(TokenType.KEYWORD)
        expect(tokens[0][0].value).toBe("CLS")
    })
    it("can't tokenize :", () => {
        expect(tokens[0][1].tokentype).toBe(TokenType.COLON)
        expect(tokens[0][1].value).toBe(null)
    })
    it("can't tokenize PRINT", () => {
        expect(tokens[0][2].tokentype).toBe(TokenType.KEYWORD)
        expect(tokens[0][2].value).toBe("PRINT")
    })
})
