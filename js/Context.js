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
        if (name in this.symtable) {
            this.symtable[name] = value
            return this
        } else {
            return undefined
        }
    }
    declareVar(name) {
        if (!(name in this.symtable)) {
            this.symtable[name] = undefined
            return this
        } else {
            return undefined
        }
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
    testVarThisContext(name) {
        return name in this.symtable
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
