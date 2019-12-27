import { buildCache, grid, mask, process } from "../lib"
import { IConfig, IGrid, IResult, IStorage  } from "../lib/types"

const banana = 0
const kiwi = 1
const orange = 2
const wild = 3

const bananasW = 10
const kiwisW = 10
const orangesW = 10
const wildW = 10

const storage: IStorage = {}

const filledGrid: IGrid = {
    freeSpin: {
        multiplier: 0,
        symbols: 0,
        total: 0,
    },
    symbols: [],
}

test('5 reels; 1 row; 3 symbols per reel', () => {
    const config: IConfig = {
        m: [
            [0, 0, 0, 0, 0],            // line definition
            // only one line (LTR) is possible
        ],
        p: [
            [0, 0, 1],                  // 1 banana pays      0
            // 2 bananas pays     0
            // 3 bananas pays     1
            [0, 2, 5],                  // 1 kiwi pays        0
            // 2 kiwis pays       2
            // 3 kiwis pays       5
            [10, 20, 100],              // 1 orange pays     10
            // 2 oranges pays    20
            // 3 oranges pays   100
        ],
        r: 1,
        w: [
            [bananasW, kiwisW, orangesW],  // first reel
            [bananasW, kiwisW, orangesW],  // second reel
            [bananasW, kiwisW, orangesW],  // third reel
        ],
    }

    expect(process(config, filledGrid, [[banana, kiwi, orange]], storage).prize).toBe(0)
    expect(process(config, filledGrid, [[banana, banana, orange]], storage).prize).toBe(0)
    expect(process(config, filledGrid, [[banana, banana, banana]], storage).prize).toBe(1)

    expect(process(config, filledGrid, [[kiwi, kiwi, orange]], storage).prize).toBe(2)
    expect(process(config, filledGrid, [[orange, kiwi, kiwi]], storage).prize).toBe(10)

    expect(process(config, filledGrid, [[orange, orange, kiwi]], storage).prize).toBe(20)
    expect(process(config, filledGrid, [[orange, orange, orange]], storage).prize).toBe(100)
})


test('5 reels; 1 row; 4 symbols per reel (Wild)', () => {
    const config: IConfig = {
        m: [
            [0, 0, 0, 0, 0],            // line definition
            // only one line (LTR) is possible
        ],
        p: [
            [0, 0, 1],                  // 1 banana pays      0
            // 2 bananas pays     0
            // 3 bananas pays     1
            [0, 2, 5],                  // 1 kiwi pays        0
            // 2 kiwis pays       2
            // 3 kiwis pays       5
            [10, 20, 100],              // 1 orange pays     10
            // 2 oranges pays    20
            // 3 oranges pays   100
        ],
        r: 1,
        w: [
            [bananasW, kiwisW, orangesW, wildW],  // first reel
            [bananasW, kiwisW, orangesW, wildW],  // second reel
            [bananasW, kiwisW, orangesW, wildW],  // third reel
        ],
        wild: {
            index: 3,                   // the last symbol is the wildcard
        }
    }

    expect(process(config, filledGrid, [[wild, wild, wild]], storage).prize).toBe(0)
    expect(process(config, filledGrid, [[wild, banana, banana]], storage).prize).toBe(1)
    expect(process(config, filledGrid, [[banana, wild, banana]], storage).prize).toBe(1)
    expect(process(config, filledGrid, [[wild, kiwi, orange]], storage).prize).toBe(2)
    expect(process(config, filledGrid, [[orange, wild, kiwi]], storage).prize).toBe(20)
    expect(process(config, filledGrid, [[orange, wild, orange]], storage).prize).toBe(100)
    expect(process(config, filledGrid, [[orange, orange, kiwi]], storage).prize).toBe(20)
    expect(process(config, filledGrid, [[orange, orange, wild]], storage).prize).toBe(100)
})

test('generate results', () => {
    const config: IConfig = {
        freeSpin: {
            conditions: [
                { count: 3, multiply: 10, total: 10 }
            ],
            index: 1,
        },
        m: [
            [0, 0, 0]
        ],
        p: [
            [0, 0, 0],
            [0, 0, 100],
            [0, 0, 0],
        ],
        r: 1,
        w: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ],
    }
    const cache = buildCache(config)
    const firstSpin: IGrid = grid(config, cache)
    const firstSpinLines: IResult = process(config, firstSpin, mask(config, firstSpin), storage)
    expect(firstSpinLines.prize).toBe(100)
    expect(firstSpin.freeSpin.multiplier).toBe(10)


    const secondSpin: IGrid = grid(config, cache)
    const secondSpinLines: IResult = process(config, firstSpin, mask(config, secondSpin), firstSpinLines.exitStorage)
    expect(secondSpinLines.prize).toBe(100 * 10)
    expect(secondSpin.freeSpin.multiplier).toBe(10)

    expect(secondSpinLines.exitStorage.freeSpin?.total).toBe(10 + 10 - 1)

})