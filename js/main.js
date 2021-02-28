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

prog.value = `# Choose an example from above\n# or write your own program\n# then click the "Run" button\n\ncls:println "Hello, world!"`
document.getElementById("output").value = "Text output"

function showError(source, e) {
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
                    const startTime = new Date().getTime()
                    error = new Interpreter(ast).interpret()
                    const endTime = new Date().getTime()
                    console.log(endTime - startTime, "ms")
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
