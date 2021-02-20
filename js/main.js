function go() {
    const prog = document.getElementById("input").value
    try {
        const tokens = new Lexer(prog).makeTokens()
        //console.log(tokens)
        const ast = new Parser(tokens).parse()
        console.log(ast)
    } catch (e) {
        alert(e)
    }
}
