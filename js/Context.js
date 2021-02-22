class Context {
    constructor(context = "<anonymous>", parentContext = undefined) {
        if (parentContext) {
            context = `${parentContext.context}.${context}`
        }
        this.context = context
        this.parentContext = parentContext
        this.symbolTable = new SymbolTable(context, parentContext)
    }
}

class SymbolTable {
    constructor(context, parentContext) {
        this.context = context
        this.parentContext = parentContext
        this.symtable = {}
    }
    setVar(name, value) {
        this.symtable[name] = value
    }
    getVar(name) {
        if (name in this.symtable) {
            return this.symtable[name]
        } else if (this.parentContext?.symbolTable.testVar(name)) {
            return this.parentContext.symbolTable.getVar(name)
        } else {
            return undefined
        }
    }
    testVar(name) {
        if (name in this.symtable) {
            return true
        } else if (this.parentContext?.symbolTable.symtable) {
            return name in this.parentContext.symbolTable.symtable
        } else {
            return false
        }
    }
    getAllVars() {
        const result = []
        for (let key in this.symtable) {
            result.push(`${this.context}: ${key} := ${this.symtable[key].str()}`)
        }
        return result
    }
}
