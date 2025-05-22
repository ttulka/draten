const draten = require('./draten')

test('error: empty code', () => {
    expect(() => draten('')).toThrow('ERR_EMPTY_PROGRAM')
})

test('error: invalid start', () => {
    expect(() => draten('━')).toThrow('ERR_MISSING_START')
    expect(() => draten('➧➧')).toThrow('ERR_MULTIPLE_STARTS')
    expect(() => draten('➧ ➧')).toThrow('ERR_MULTIPLE_STARTS')
})

test('error: short circuit', () => {
    expect(() => draten('➧┃')).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten('➧┏')).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten('➧┗')).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten('➧┣A')).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten('➧A┫')).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten('➧━┃')).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten('➧━┗')).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten(`
        ➧━┓
          ━
    `)).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten(`
        ➧━┓
          ┓
    `)).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten(`
        ➧━┓
          ┳
          A
    `)).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten(`
          ┗
        ➧━┛
    `)).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten(`
          ━
        ➧━┛
    `)).toThrow('ERR_SHORT_CIRCUIT')
    expect(() => draten(`
          A
          ┻
        ➧━┛
    `)).toThrow('ERR_SHORT_CIRCUIT')
})

test('start', () => {
    expect(draten('➧━')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧┓')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧┛')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('max steps: infinite loops', () => {
    expect(() => draten(`
        ➧━┓
         ┗┛
    `)).toThrow('ERR_MAX_STEPS_EXCEEDED')
    expect(() => draten(`
        ➧━━┓
         ┗━┛
    `)).toThrow('ERR_MAX_STEPS_EXCEEDED')
    expect(() => draten(`
        ➧━┓
         ┃┃
         ┗┛
    `)).toThrow('ERR_MAX_STEPS_EXCEEDED')
    expect(() => draten(`
        ➧━━┓
         ┃ ┃
         ┗━┛
    `)).toThrow('ERR_MAX_STEPS_EXCEEDED')
})

test('empty program', () => {
    expect(draten('➧')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧━')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧━━')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('initial values', () => {
    expect(draten('➧', 1, 2, 3)).toStrictEqual([1, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧', 3, 2, 1)).toStrictEqual([3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('out of reach ignored', () => {
    expect(draten('➧ A')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧━ A')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧━ A━')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧━ ━A━')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧━━ ━A━')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('increment', () => {
    expect(draten('➧A')).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧AA')).toStrictEqual([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧AAA')).toStrictEqual([3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧BB')).toStrictEqual([0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧BBC')).toStrictEqual([0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧AB')).toStrictEqual([1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧BBBAAC')).toStrictEqual([2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧━━BBB━AA━━━C')).toStrictEqual([2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧━━B━B━B━A━A━━━C━')).toStrictEqual([2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('decrement', () => {
    expect(draten('➧a')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧aa')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧aaa')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧AAAa')).toStrictEqual([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧AAAaa')).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧AAAaaa')).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧BBBa')).toStrictEqual([0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧BBBCCCbca')).toStrictEqual([0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten('➧BBBaCCCbcb')).toStrictEqual([0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('wires', () => {
    expect(draten(`
        ➧━━┓     ┏━┓
           ┃  ┏┓ ┃ ┃   ┏━━A
           ┃ ┏┛┗━┛ ┗━┓ ┃
           ┗━┛       ┗━┛
    `)).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('branching', () => {
    expect(() => draten('➧┳')).toThrow('ERR_MISSING_PARAMETER')
    expect(() => draten('➧┻')).toThrow('ERR_MISSING_PARAMETER')
    expect(() => draten(`
         ┣
        ➧┛
    `)).toThrow('ERR_MISSING_PARAMETER')
    expect(() => draten(`
          ➧┓
           ┫
    `)).toThrow('ERR_MISSING_PARAMETER')
    expect(draten(`
        ➧┳A
         B
    `)).toStrictEqual([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten(`
        ➧A┳B
          a
    `)).toStrictEqual([1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten(`
         A
        ➧┻B
    `)).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten(`
         B
         ┣A
        ➧┛
    `)).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten(`
          ➧┓
          A┫
           B
    `)).toStrictEqual([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('loop', () => {
    expect(draten(`
            C
            a
        ➧AAA┻aB┓
            ┗━━┛
    `)).toStrictEqual([0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten(`
            ┏━━┓
        ➧AAA┳aB┛
            a
            C    
    `)).toStrictEqual([0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('clear', () => {
    expect(draten(`
         ┏━┓
        ➧┳a┛
         a
    `, 42)).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('move', () => {
    expect(draten(`
         ┏━━┓
        ➧┳aB┛
         a
    `, 42)).toStrictEqual([0, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('copy', () => {
    expect(draten(`
         ┏━━━┓
        ➧┳aBC┛
         a
         ┃c
         ┗┻cA┓
          ┗━━┛
    `, 42)).toStrictEqual([42, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten(`
         ┏━━━┓
        ➧┳aBC┛
         a    c
         ┗━━━━┻cA┓
              ┗━━┛
    `, 42)).toStrictEqual([42, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    expect(draten(`
         ┏━━━┓
        ➧┳aBC┛c
         a   ┏┻cA┓
         ┗━━━┛┗━━┛
    `, 42)).toStrictEqual([42, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('switch', () => {
    expect(draten(`
         ┏━━┓┏┓  c
        ➧┳aC┛b┗━━┻cB┓
         a  ┏┻bA┓┗━━┛
         ┗━━┛┗━━┛
    `, 42, 13)).toStrictEqual([13, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('addition', () => {
    expect(draten(`
         ┏━━┓
        ➧┳bA┛
         b
    `, 42, 13)).toStrictEqual([55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('multiplication', () => {
    expect(draten(`
         ┏━━━━━━━━━━━┓
         ┃ ┏━━━┓ ┏━━┓┃
        ➧┳a┳bCD┛┏┳dB┛┃
         a b┏━━━┛d┏━━┛
           ┗┛    ┗┛
    `, 42, 13)).toStrictEqual([0, 13, 546, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})

test('Hello World', () => {
    // ' ' => 1
    // 'd' => 2
    // 'e' => 3
    // 'H' => 4
    // 'l' => 5
    // 'o' => 6
    // 'r' => 7
    // 'W' => 8
    expect(draten(`
        KKJJJJJIIIIIIIHHHHHHGGGGGGGG┓  
           ➧AAAABBBCCCCCDDDDDEEEEEE┓┃    ┏━━┓        ┏F┓
                                   ┃┃    ┃┏┓┗┓  ┏┓  ┏┛┏┛
                                   ┃┗━━━━┛┃┗┓┗┓┏┛┗┓┏┛┏┛
                                   ┃┏━━━━┓┃ ┗┓┗┛┏┓┗┛┏┛
                                   ┃┃    ┃┃  ┗┓┏┛┗┓┏┛
                                   ┗┛    ┗┛   ┗┛  ┗┛
    `)).toStrictEqual([4, 3, 5, 5, 6, 1, 8, 6, 7, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
})