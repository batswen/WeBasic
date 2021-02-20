class Position {
    constructor(pos, line, col) {
        this.pos = pos
        this.line = line
        this.col = col
    }
    advance(char = undefined) {
        this.pos++
        this.col++

        if (char === "\n") {
            this.col = 0
            this.line++
        }
    }
    toString() {
        return `source position: ${this.pos}, column: ${this.col}, line: ${this.line}`
    }
}
