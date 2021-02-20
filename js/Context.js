class Context {
    constructor(context) {
        this.context = context
        this.symbolTable = new SymbolTable()
    }
}

class SymbolTable {
    constructor() {
        this.symtable = {}
    }
    setVar(name, value) {
        this.symtable[name] = value
    }
    getVar(name) {
        if (name in this.symtable) {
            return this.symtable[name]
        } else {

        }
    }
    testVar(name) {
        return name in this.symtable
    }
    showVars() {
        for (let key in this.symtable) {
            console.log(`Var: ${key}:=${this.symtable[key].value}`)
        }
    }
}
