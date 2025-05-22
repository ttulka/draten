const MAX_STEPS = 100000
const RIGHT = 1, LEFT = 2, UP = 3, DOWN = 4
const REGEX_UPPER = new RegExp('[A-Z]')
const REGEX_LOWER = new RegExp('[a-z]')

const ERR_SHORT_CIRCUIT = 'ERR_SHORT_CIRCUIT'
const ERR_EMPTY_PROGRAM = 'ERR_EMPTY_PROGRAM'
const ERR_INVALID_VALUES_LENGTH = 'ERR_INVALID_VALUES_LENGTH'
const ERR_INVALID_VALUES = 'ERR_INVALID_VALUES'
const ERR_MAX_STEPS_EXCEEDED = 'ERR_MAX_STEPS_EXCEEDED'
const ERR_MISSING_START = 'ERR_MISSING_START'
const ERR_MULTIPLE_STARTS = 'ERR_MULTIPLE_STARTS'
const ERR_MISSING_PARAMETER = 'ERR_MISSING_PARAMETER'

const interpret = (program, ...initValues) => {
    if (!program) throw new Error(ERR_EMPTY_PROGRAM)
    if (initValues.length > 26) throw new Error(ERR_INVALID_VALUES_LENGTH)
    if (initValues.some(v => v < 0)) throw new Error(ERR_INVALID_VALUES)
    
    // initialize
    const p = parse(program)
    const r = new Array(26).fill(0)
    initValues.forEach((v,i) => r[i] = v)

    // execute
    let [x, y] = findStart(p)   // program counters
    let sc = 0                  // step counter
    let d = RIGHT               // direction

    exec: while (p[y] && p[y][x]) {
        if (sc++ > MAX_STEPS) throw new Error(ERR_MAX_STEPS_EXCEEDED)

        const e = p[y][x]
        if (!e.flow) e.flow = d

        let v
        
        switch (e.symbol) {
            case '➧':
                x++
                continue exec
            case '━':
                if (RIGHT === e.flow) x++
                else if (LEFT === e.flow) x--
                else throw new Error(ERR_SHORT_CIRCUIT)
                continue exec
            case '┃':
                if (UP === e.flow) y--
                else if (DOWN === (e.flow || d)) y++
                else throw new Error(ERR_SHORT_CIRCUIT)
                continue exec
            case '┏':
                if (UP === e.flow) {
                    d = RIGHT
                    x++
                }
                else if (LEFT === e.flow) {
                    d = DOWN
                    y++
                }
                else throw new Error(ERR_SHORT_CIRCUIT)
                
                continue exec
            case '┓':
                if (UP === e.flow) {
                    d = LEFT
                    x--
                }
                else if (RIGHT === e.flow) {
                    d = DOWN
                    y++
                }
                else throw new Error(ERR_SHORT_CIRCUIT)
                continue exec
            case '┗':
                if (DOWN === e.flow) {
                    d = RIGHT
                    x++
                }
                else if (LEFT === e.flow) {
                    d = UP
                    y--
                }
                else throw new Error(ERR_SHORT_CIRCUIT)
                continue exec
            case '┛':
                if (DOWN === e.flow) {
                    d = LEFT
                    x--
                }
                else if (RIGHT === e.flow) {
                    d = UP
                    y--
                }
                else throw new Error(ERR_SHORT_CIRCUIT)
                continue exec
            case '┣':
                v = registerValue(p, x + 1, y, r)
                if (DOWN === e.flow) {
                    if (!v) {
                        d = RIGHT
                        x++
                    } else {
                        y++
                    }
                }
                else if (UP === e.flow) {
                    if (!v) {
                        d = RIGHT
                        x++
                    } else {
                        y--
                    }
                }
                else throw new Error(ERR_SHORT_CIRCUIT)
                continue exec
            case '┫':
                v = registerValue(p, x - 1, y, r)
                if (DOWN === e.flow) {
                    if (!v) {
                        d = LEFT
                        x--
                    } else {
                        y++
                    }
                }
                else if (UP === e.flow) {
                    if (!v) {
                        d = LEFT
                        x--
                    } else {
                        y--
                    }
                }
                else throw new Error(ERR_SHORT_CIRCUIT)
                continue exec
            case '┳':
                v = registerValue(p, x, y + 1, r)
                if (RIGHT === e.flow) {
                    if (!v) {
                        d = DOWN
                        y++
                    } else {
                        x++
                    }
                }
                else if (LEFT === e.flow) {
                    if (!v) {
                        d = DOWN
                        y++
                    } else {
                        x--
                    }
                }
                else throw new Error(ERR_SHORT_CIRCUIT)
                continue exec
            case '┻':
                v = registerValue(p, x, y - 1, r)
                if (RIGHT === e.flow) {
                    if (!v) {
                        d = UP
                        y--
                    } else {
                        x++
                    }
                }
                else if (LEFT === e.flow) {
                    if (!v) {
                        d = UP
                        y--
                    } else {
                        x--
                    }
                }
                else throw new Error(ERR_SHORT_CIRCUIT)
                continue exec
        }

        if (REGEX_UPPER.test(e.symbol)) {
            r[registerIndex(e.symbol)]++
        }
        else if (REGEX_LOWER.test(e.symbol)) {
            const ri = registerIndex(e.symbol)
            if (r[ri] > 0) r[ri]--
        }
        switch (e.flow) {
            case RIGHT:
                x++
                break
            case LEFT:
                x--
                break
            case UP:
                y--
                break
            case DOWN:
                y++
                break
        }
    }

    return r

    function findStart(p) {
        let start
        for (let y = 0; y < p.length; y++) {
            for (let x = 0; x < p[y].length; x++) {
                if (p[y][x] && p[y][x].symbol === '➧') {
                    if (start) throw new Error(ERR_MULTIPLE_STARTS)
                    start = [x, y]
                }
            }
        }
        if (!start) throw new Error(ERR_MISSING_START)
        return start
    }

    function registerValue(p, x, y, r) {
        const e = (p[y] || [])[x]
        if (!e || (!REGEX_UPPER.test(e.symbol) && !REGEX_LOWER.test(e.symbol))) {
            throw new Error(ERR_MISSING_PARAMETER)
        }
        return r[registerIndex(e.symbol)]
    }

    function registerIndex(regname) {
        return regname.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)
    }
}

// parse the program to an 2D array
function parse(program) {    
    const lines = program.replaceAll(/[^a-zA-Z➧━┃┏┓┗┛┣┫┳┻\n]/g, '.') // replace all except a-z, A-Z, ➧, ━, ┃, ┏, ┓, ┗, ┛, ┣, ┫, ┳, ┻, and new lines
                          .split('\n') // to lines

    if (!lines.length) throw new Error('Syntax error: program must consist of at least the start symbol "➧"')

    const ast = []
    for (let li = 0; li < lines.length; li++) {
        const line = lines[li].split('')
        ast.push([])
        for (let ci = 0; ci < line.length; ci++) {
            ast[li].push(line[ci] !== '.' ? new Element(line[ci]) : null)
        }
    }
    return ast
}

class Element {
    constructor(symbol) {
        this.symbol = symbol
        this.flow = null
    }
}

module.exports = interpret