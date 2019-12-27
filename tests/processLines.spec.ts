import { processLines } from "../lib"
import { IConfig, IStorage } from "../lib/types"

const banana = 0
const kiwi = 1
const orange = 2
const wild = 3

const bananasW = 10
const kiwisW = 10
const orangesW = 10
const wildW = 10

const storage: IStorage = {
    multiplier: 1,
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

    expect(processLines(config, [[banana, kiwi, orange]], storage).prize).toBe(0)
    expect(processLines(config, [[banana, banana, orange]], storage).prize).toBe(0)
    expect(processLines(config, [[banana, banana, banana]], storage).prize).toBe(1)

    expect(processLines(config, [[kiwi, kiwi, orange]], storage).prize).toBe(2)
    expect(processLines(config, [[orange, kiwi, kiwi]], storage).prize).toBe(10)

    expect(processLines(config, [[orange, orange, kiwi]], storage).prize).toBe(20)
    expect(processLines(config, [[orange, orange, orange]], storage).prize).toBe(100)
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

    expect(processLines(config, [[wild, wild, wild]], storage).prize).toBe(0)
    expect(processLines(config, [[wild, banana, banana]], storage).prize).toBe(1)
    expect(processLines(config, [[banana, wild, banana]], storage).prize).toBe(1)
    expect(processLines(config, [[wild, kiwi, orange]], storage).prize).toBe(2)
    expect(processLines(config, [[orange, wild, kiwi]], storage).prize).toBe(20)
    expect(processLines(config, [[orange, wild, orange]], storage).prize).toBe(100)
    expect(processLines(config, [[orange, orange, kiwi]], storage).prize).toBe(20)
    expect(processLines(config, [[orange, orange, wild]], storage).prize).toBe(100)
})