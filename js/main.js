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

prog.value = "var a:a=[8,7,6]\na[0]=1:dump"
document.getElementById("output").value = ""

function showError(source, e) {
    if (e.details) {
        console.log(e.details)
    }
    modalHeader.textContent = `(${source}): ${e.title ? e.title : "Error"}`
    modalMessage.textContent = e.msg
    modalLine.textContent = e.position?.line
    modalColumn.textContent = e.position?.col
    modal.style.display = "block"
}

function go() {
    let error, tokens, ast
    try {
        [tokens, error] = new Lexer(prog.value).makeTokens()
        if (error) {
            showError("Lexer", error)
            if (tokens) console.log(tokens)
        } else {
            if (tokens && error === undefined) {
                [ast, error] = new Parser(tokens).parse()
            }
            if (error) {
                showError("Parser", error)
                if (tokens) console.log(tokens)
                if (ast) console.log(ast)
            } else {
                if (ast && error === undefined) {
                    error = new Interpreter(ast).interpret()
                }
                if (error) {
                    showError("Interpreter", error)
                    if (tokens) console.log(tokens)
                    if (ast) console.log(ast)
                }
            }
        }
    } catch (e) {
        if (e !== "error") {
            console.log(e)
        }
    }
}

select.addEventListener("change", e =>
    prog.value = examples[select.value]
)

document.getElementById("modal-close").addEventListener("click", e => modal.style.display = "none")
