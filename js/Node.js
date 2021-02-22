class Node {
    constructor(position) {
        this.position = position
    }
}

class StatementNode extends Node {
    constructor(position, left, right) {
        super(position)
        this.left = left
        this.right = right
    }
}

class IdentifierNode extends Node {
    constructor(position, identifier, access) {
        super(position)
        this.identifier = identifier
        this.access = access
    }
}

class NamespaceNode extends Node {
    constructor(position, namespace, prog) {
        super(position)
        this.namespace = namespace
        this.prog = prog
    }
}

class AssignNode extends Node {
    constructor(position, name, value) {
        super(position)
        this.name = name
        this.value = value
    }
}

class StringNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class IntNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class FloatNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class ListNode extends Node {
    constructor(position, args, access) {
        super(position)
        this.args = args
        this.access = access
    }
}

class PrintNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

class PrintLNNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

class DumpNode extends Node {
    constructor(position) {
        super(position)
    }
}

class CPrintNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class CDumpNode extends Node {
    constructor(position) {
        super(position)
    }
}

class BinOpNode extends Node {
    constructor(position, left, operator, right) {
        super(position)
        this.left = left
        this.operator = operator
        this.right = right
    }
}

class UnOpNode extends Node {
    constructor(position, left, operator) {
        super(position)
        this.left = left
        this.operator = operator
    }
}

class DTListNode extends Node {
    constructor(position, list) {
        super(position)
        this.list = list
    }
}

class WhileNode extends Node {
    constructor(position, condition, whiledo) {
        super(position)
        this.condition = condition
        this.whiledo = whiledo
    }
}

class IfNode extends Node {
    constructor(position, condition, ifthen, ifelse) {
        super(position)
        this.condition = condition
        this.ifthen = ifthen
        this.ifelse = ifelse
    }
}

class ClsNode extends Node {
    constructor(position) {
        super(position)
    }
}
