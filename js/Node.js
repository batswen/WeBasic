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

class ReturnNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class IntConvNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class FloatConvNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class StringConvNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class IntTestNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class FloatTestNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class StringTestNode extends Node {
    constructor(position, value) {
        super(position)
        this.value = value
    }
}

class SinNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

class CosNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

class TanNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

class AbsNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

class RoundNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}


class CeilNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

class FloorNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

class LogNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

class ExpNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

class SignNode extends Node {
    constructor(position, arg) {
        super(position)
        this.arg = arg
    }
}

class PowerNode extends Node {
    constructor(position, arg, exp) {
        super(position)
        this.arg = arg
        this.exp = exp
    }
}

class InputNode extends Node {
    constructor(position, prompt) {
        super(position)
        this.prompt = prompt
    }
}

class ForNode extends Node {
    constructor(position, forIdentifier, forStart, forEnd, forStep, forProg) {
        super(position)
        this.forIdentifier = forIdentifier
        this.forStart = forStart
        this.forEnd = forEnd
        this.forStep = forStep
        this.forProg = forProg
    }
}

class DeclareIdentifierNode extends Node {
    constructor(position, identifier, access) {
        super(position)
        this.identifier = identifier
        this.access = access
    }
}

class DeclareIfUndeclaredIdentifierNode extends Node {
    constructor(position, identifier) {
        super(position)
        this.identifier = identifier
    }
}

class FuncDefNode extends Node {
    constructor(position, identifier, prog, args, retvalue) {
        super(position)
        this.identifier = identifier
        this.prog = prog
        this.args = args
        this.retvalue = retvalue
    }
}

class FuncCallNode extends Node {
    constructor(position, identifier, args) {
        super(position)
        this.identifier = identifier
        this.args = args
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
    constructor(position, name, value, writeAccess) {
        super(position)
        this.name = name
        this.value = value
        this.writeAccess = writeAccess
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

class AscNode extends Node {
    constructor(position, str) {
        super(position)
        this.str = str
    }
}

class CharNode extends Node {
    constructor(position, num) {
        super(position)
        this.num = num
    }
}

class LeftNode extends Node {
    constructor(position, str, num) {
        super(position)
        this.str = str
        this.num = num
    }
}

class RightNode extends Node {
    constructor(position, str, num) {
        super(position)
        this.str = str
        this.num = num
    }
}

class MidNode extends Node {
    constructor(position, str, num, amount) {
        super(position)
        this.str = str
        this.num = num
        this.amount = amount
    }
}

class ColorNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

class FillColorNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

class LineWidthNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

class PointNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

class LineNode extends Node {
    constructor(position, args) {
        super(position)
        this.args = args
    }
}

class RectNode extends Node {
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

class DateNode extends Node {
    constructor(position) {
        super(position)
    }
}

class TimeNode extends Node {
    constructor(position) {
        super(position)
    }
}

class RandomNode extends Node {
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
