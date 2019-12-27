import { IStorage, ILines, IGrid, IConfig } from "../lib/types"
import { grid, processLines, mask, buildCache } from "../lib"

let storage: IStorage

beforeAll(() => {
    storage = {}
})

test('generate results', () => {
    const config: IConfig = {
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
        freeSpin: {
            index: 1,
            conditions: [
                { count: 3, multiply: 10, total: 10 }
            ]
        }
    }
    const cache = buildCache(config)
    const firstSpin: IGrid = grid(config, cache)
    const firstSpinLines: ILines = processLines(config, firstSpin, mask(config, firstSpin), storage)
    expect(firstSpinLines.prize).toBe(100)
    expect(firstSpin.freeSpin.multiplier).toBe(10)


    const secondSpin: IGrid = grid(config, cache)
    const secondSpinLines: ILines = processLines(config, firstSpin, mask(config, secondSpin), firstSpinLines.exitStorage)
    expect(secondSpinLines.prize).toBe(100 * 10)
    expect(secondSpin.freeSpin.multiplier).toBe(10)

    expect(secondSpinLines.exitStorage.freeSpin?.total).toBe(10 + 10 - 1)

})