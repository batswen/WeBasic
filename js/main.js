const prog = document.getElementById("input")
prog.value = `a=3<5-2\nb="a"=="a":c="a"*5+"xyz"\na0_A = 3 * -5\ncc = 15 and 7:xcv = "\\q\\\\\\a"\na_0 = 5:if a_0 > 0 then a_cond = "Ja"\n\n`
prog.value += `x_if = 0:if x_if == 0 then result = "true" else result = "false"\n`
prog.value += `x_if = 1:if x_if == 0 then result = "true" else result = "false"`
function go() {
    // try {
        const tokens = new Lexer(prog.value).makeTokens()
        //console.log(tokens)
        const ast = new Parser(tokens).parse()
        //console.log(ast)
        const result = new Interpreter(ast).interpret()
        if (result !== undefined) {
            document.getElementById("result").value = result.value
        }

    // } catch (e) {
    //     alert(e)
    // }
}
