const prog = document.getElementById("input")
const select = document.getElementById("select")

for (let e in examples) {
    const opt = document.createElement("option")
    opt.value = e
    opt.innerHTML = e
    select.appendChild(opt)
}

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

select.addEventListener("change", e =>
    prog.value = examples[select.value]
)
