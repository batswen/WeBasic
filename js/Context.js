class Context {
    constructor(context) {
        this.context = context
        this.symbolTable = new SymbolTable(context)
    }
}

class SymbolTable {
    constructor(context) {
        this.context = context
        this.symtable = {}
    }
    setVar(name, value) {
        this.symtable[name] = value
    }
    getVar(name) {
        if (name in this.symtable) {
            return this.symtable[name]
        }
    }
    testVar(name) {
        return name in this.symtable
    }
    showVars() {
        for (let key in this.symtable) {
            console.log(`<${this.context}>: ${key}:=${this.symtable[key].value}`)
        }
    }
}
