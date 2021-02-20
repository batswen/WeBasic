function go() {
    const prog = document.getElementById("input").value
    try {
        console.log(new Lexer(prog).makeTokens())
    } catch (e) {

    }
}
