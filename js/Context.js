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
    setVar(name, value, writeElement = undefined) {
        if (name in this.symtable) {
            if (writeElement !== undefined) {
                this.symtable[name].setElement(writeElement, value)
            } else {
                this.symtable[name] = value
            }
            return this
        } else {
            return undefined
        }
    }
    declareVar(name) {
        if (!(name in this.symtable)) {
            this.symtable[name] = new DTNull()
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
        let result = []
        for (let key in this.symtable) {
            result.push(`${this.context}: ${key} := ${this.symtable[key].str()}`)
        }
        if (this.parentContext?.symbolTable) {
            result = result.concat(this.parentContext.symbolTable.getAllVars())
        }
        return result
    }
}
