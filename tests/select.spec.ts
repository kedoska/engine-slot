import { select } from "../lib"

test('simple test', () => {
    // there are 3 symbols in the reels
    const bananas = 10
    const kiwis = 10
    const oranges = 10
    const reel = [bananas, kiwis, oranges]
    const rr = [ reel, reel, reel ]

    // the random is 15
    const random = 15
    
    // 15 is bigger than 10 (so the pointer is not inside the bananas...)
    const expectedSymbolIndex = 1
    expect(select(0, rr, random)).toBe(expectedSymbolIndex)
})

const reels = [ // three reels having 5 symbols
    [10,10,10,10,10],
                    [10,10,10,10,10],
                                    [10,10,10,10,10],
]

const onTheFirstReel = 0

test('first symbol with 1', () => expect(select(onTheFirstReel, reels, 1)).toBe(0))

test('first symbol with exact value', () => expect(select(onTheFirstReel, reels, 10)).toBe(0))

test('first symbol withing range', () => expect(select(onTheFirstReel, reels, 8)).toBe(0))

test('second symbol with exact value', () => expect(select(onTheFirstReel, reels, 11)).toBe(1))

test('second symbol withing range', () => expect(select(onTheFirstReel, reels, 15)).toBe(1))