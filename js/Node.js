export class Node {
    constructor(position) {
        this.position = position
    }
}

export class StatementNode extends Node {
    constructor(position, left, right) {
        super(position)
        this.left = left
        this.right = right
    }
}

export class IdentifierNode extends Node {
    constructor(position, identifier, access) {
        super(position)
        this.identifier = identifier
        this.access = access
    }
}

export class ReturnNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class IntConvNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class FloatConvNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class StringConvNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class IntTestNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class FloatTestNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class StringTestNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class SinNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

export class CosNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

export class TanNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

export class AbsNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

export class RoundNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}


export class CeilNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

export class FloorNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

export class LogNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

export class ExpNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

export class SignNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

export class PowerNode extends Node {
    constructor(position, arg, exp) {
        super(position)
        this.arg = arg
        this.exp = exp
    }
}

export class InputNode extends Node {
    constructor(position, prompt) {
        super(position)
        this.prompt = prompt
    }
}

export class ForNode extends Node {
    constructor(position, forIdentifier, forStart, forEnd, forStep, forProg) {
        super(position)
        this.forIdentifier = forIdentifier
        this.forStart = forStart
        this.forEnd = forEnd
        this.forStep = forStep
        this.forProg = forProg
    }
}

export class DeclareIdentifierNode extends Node {
    constructor(position, identifier, access) {
        super(position)
        this.identifier = identifier
        this.access = access
    }
}

export class DeclareIfUndeclaredIdentifierNode extends Node {
    constructor(position, identifier) {
        super(position)
        this.identifier = identifier
    }
}

export class FuncDefNode extends Node {
    constructor(position, identifier, prog, args, retvalue) {
        super(position)
        this.identifier = identifier
        this.prog = prog
        this.args = args
        this.retvalue = retvalue
    }
}

export class FuncCallNode extends Node {
    constructor(position, identifier, args) {
        super(position)
        this.identifier = identifier
        this.args = args
    }
}

export class NamespaceNode extends Node {
    constructor(position, namespace, prog) {
        super(position)
        this.namespace = namespace
        this.prog = prog
    }
}

export class AssignNode extends Node {
    constructor(position, name, value, writeAccess) {
        super(position)
        this.name = name
        this.value = value
        this.writeAccess = writeAccess
    }
}

export class StringNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class IntNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class FloatNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class ListNode extends Node {
    constructor(position, args, access) {
        super(position)
        this.args = args
        this.access = access
    }
}

export class PrintNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

export class AscNode extends Node {
    constructor(position, str) {
        super(position)
        this.str = str
    }
}

export class CharNode extends Node {
    constructor(position, num) {
        super(position)
        this.num = num
    }
}

export class LeftNode extends Node {
    constructor(position, str, num) {
        super(position)
        this.str = str
        this.num = num
    }
}

export class RightNode extends Node {
    constructor(position, str, num) {
        super(position)
        this.str = str
        this.num = num
    }
}

export class MidNode extends Node {
    constructor(position, str, num, amount) {
        super(position)
        this.str = str
        this.num = num
        this.amount = amount
    }
}

export class ColorNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

export class FillColorNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

export class LineWidthNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

export class PointNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

export class LineNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

export class RectNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

export class PrintLNNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

export class DumpNode extends Node {
    constructor(position) {
        super(position)
    }
}

export class ClearNode extends Node {
    constructor(position) {
        super(position)
    }
}

export class DateNode extends Node {
    constructor(position) {
        super(position)
    }
}

export class TimeNode extends Node {
    constructor(position) {
        super(position)
    }
}

export class RandomNode extends Node {
    constructor(position) {
        super(position)
    }
}

export class CPrintNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

export class CDumpNode extends Node {
    constructor(position) {
        super(position)
    }
}

export class BinOpNode extends Node {
    constructor(position, left, operator, right) {
        super(position)
        this.left = left
        this.operator = operator
        this.right = right
    }
}

export class UnOpNode extends Node {
    constructor(position, left, operator) {
        super(position)
        this.left = left
        this.operator = operator
    }
}

export class DTListNode extends Node {
    constructor(position, list) {
        super(position)
        this.list = list
    }
}

export class WhileNode extends Node {
    constructor(position, condition, whiledo) {
        super(position)
        this.condition = condition
        this.whiledo = whiledo
    }
}

export class IfNode extends Node {
    constructor(position, condition, ifthen, ifelse) {
        super(position)
        this.condition = condition
        this.ifthen = ifthen
        this.ifelse = ifelse
    }
}

export class ClsNode extends Node {
    constructor(position) {
        super(position)
    }
}
