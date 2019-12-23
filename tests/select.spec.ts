import { select } from "../lib"

test('simple test', () => {
    // there are 3 symbols in the reel
    const bananas = 10
    const kiwis = 10
    const oranges = 10
    const reel = [bananas, kiwis, oranges]

    // the random is 15
    const random = 15
    
    // 15 is bigger than 10 (so the pointer is not inside the bananas...)
    const expectedSymbolIndex = 1
    expect(select(reel, random)).toBe(expectedSymbolIndex)
})

test('first symbol with 1', () => expect(select([10,10,10,10,10], 1)).toBe(0))

test('first symbol with exact value', () => expect(select([10,10,10,10,10], 10)).toBe(0))

test('first symbol withing range', () => expect(select([10,10,10,10,10], 8)).toBe(0))

test('second symbol with exact value', () => expect(select([10,10,10,10,10], 11)).toBe(1))

test('second symbol withing range', () => expect(select([10,10,10,10,10], 15)).toBe(1))