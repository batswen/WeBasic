class DataType {
    constructor() {
        this.context = undefined
        this.position = undefined
    }
    setPosition(position) {
        this.position = position
        return this
    }
    setContext(context) {
        this.context = context
        return this
    }
}

class DTString extends DataType {
    constructor(v) {
        super()
        if (v instanceof DTString) {
            this.value = v.value
        } else {
            this.value = v
        }
    }
    add(other) {
    this.value = this.value + other.value

        return this
    }
    mul(other) {
        let result = ""
        for (let i = 0; i < other.value; i++) {
            result += this.value
        }
        this.value = result
        return this
    }
    eq(other) {
        this.value = this.value === other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    ne(other) {
        this.value = this.value !== other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    lt(other) {
        this.value = this.value < other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    le(other) {
        this.value = this.value <= other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    gt(other) {
        this.value = this.value > other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    ge(other) {
        this.value = this.value >= other.value ? 1 : 0
        return new IntNumber(this.value)
    }
}

class BaseNumber extends DataType {
    constructor(v) {
        super()
        if (v instanceof BaseNumber) {
            this.value = v.value
        } else {
            this.value = v
        }
    }
}

class IntNumber extends BaseNumber {
    constructor(value) {
        super(value)
    }
    add(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value + other.value
        }
        return this
    }
    sub(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value - other.value
        }
        return this
    }
    mul(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value * other.value
        }
        return this
    }
    div(other) {
        if (other instanceof BaseNumber) {
            if (other.value === 0) {
                throw {
                    msg: "Interpreter: division by zero"
                }
            }
            this.value = this.value / other.value
        }
        return this
    }
    or(other) {
        this.value = this.value | other.value
        return this
    }
    and(other) {
        this.value = this.value & other.value
        return this
    }
    eq(other) {
        this.value = this.value === other.value ? 1 : 0
        return this
    }
    ne(other) {
        this.value = this.value !== other.value ? 1 : 0
        return this
    }
    lt(other) {
        this.value = this.value < other.value ? 1 : 0
        return this
    }
    le(other) {
        this.value = this.value <= other.value ? 1 : 0
        return this
    }
    gt(other) {
        this.value = this.value > other.value ? 1 : 0
        return this
    }
    ge(other) {
        this.value = this.value >= other.value ? 1 : 0
        return this
    }
}

class FloatNumber extends BaseNumber {
    constructor(value) {
        super(value)
    }
    add(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value + other.value
        }
        return this
    }
    sub(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value - other.value
        }
        return this
    }
    mul(other) {
        if (other instanceof BaseNumber) {
            this.value = this.value * other.value
        }
        return this
    }
    div(other) {
        if (other instanceof BaseNumber) {
            if (other.value === 0) {
                throw {
                    msg: "Interpreter: division by zero"
                }
            }
            this.value = this.value / other.value
        }
        return this
    }
    eq(other) {
        this.value = this.value === other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    ne(other) {
        this.value = this.value !== other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    lt(other) {
        this.value = this.value < other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    le(other) {
        this.value = this.value <= other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    gt(other) {
        this.value = this.value > other.value ? 1 : 0
        return new IntNumber(this.value)
    }
    ge(other) {
        this.value = this.value >= other.value ? 1 : 0
        return new IntNumber(this.value)
    }
}
