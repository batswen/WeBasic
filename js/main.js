const prog = document.getElementById("input")
const select = document.getElementById("select")
const modal = document.querySelector(".modal")
const modalHeader = document.getElementById("modal-header")
const modalMessage = document.getElementById("modal-message")
const modalLine = document.getElementById("modal-line")
const modalColumn = document.getElementById("modal-column")

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
        modalHeader.textContent = e.title ? e.title : "Error"
        modalMessage.textContent = e.msg
        modalLine.textContent = e.position.line
        modalColumn.textContent = e.position.col
        modal.style.display = "block"
    }
}

select.addEventListener("change", e =>
    prog.value = examples[select.value]
)

document.getElementById("modal-close").addEventListener("click", e => modal.style.display = "none")
