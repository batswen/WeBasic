function go() {
    const prog = document.getElementById("input").value
    try {
        const tokens = new Lexer(prog).makeTokens()
        //console.log(tokens)
        const ast = new Parser(tokens).parse()
        // console.log(ast)
        const result = new Interpreter(ast).interpret()
        document.getElementById("result").value = result.value
    } catch (e) {
        alert(e)
    }
}
