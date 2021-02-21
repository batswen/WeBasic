const prog = document.getElementById("input")
const select = document.getElementById("select")

for (let e in examples) {
    const opt = document.createElement("option")
    opt.value = e
    opt.innerHTML = e
    select.appendChild(opt)
}

function go() {
    try {
        const tokens = new Lexer(prog.value).makeTokens()
        //console.log(tokens)
        const ast = new Parser(tokens).parse()
        //console.log(ast)
        const result = new Interpreter(ast).interpret()
        if (result !== undefined) {
            document.getElementById("result").value = result.value
        }

    } catch (e) {
        if (e.details) {
            console.log(e.details)
        }
        alert(`${e.msg}\nLine: ${e.position.line}\nColumn: ${e.position.col}`)
    }
}

select.addEventListener("change", e =>
    prog.value = examples[select.value]
)
