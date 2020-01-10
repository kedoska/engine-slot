import { buildCache, grid, distribute } from "../lib"
import { IConfig } from "../lib/types"

test('cache configuration', () => {
    const config: IConfig = {
        m: [
            [0, 0, 0]
        ],
        p: [
            [0, 0, 0]
        ],
        r: 1,
        w: [
            [47, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 5],
            [47, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 5],
            [49, 39, 28, 26, 9, 6, 6, 13, 12, 6, 2, 5],
            [49, 41, 35, 30, 13, 6, 6, 6, 6, 4, 2, 3],
            [49, 41, 35, 30, 22, 11, 8, 2, 2, 2, 2, 1],
        ],
    }
    expect(buildCache(config)).toStrictEqual([201, 201, 201, 201, 205])
})

test('simple grid', () => {
    const config: IConfig = {
        m: [
            [0, 0, 0]
        ],
        p: [
            [0, 0, 0]
        ],
        r: 1,
        w: [
            [5, 3, 2,],
            [5, 3, 2],
            [5, 3, 2],
        ],
    }
    const cache = buildCache(config)
    expect(cache.length).toBe(3)
    expect(cache).toStrictEqual([10, 10, 10])

    const g = grid(config, cache)

    expect(g.symbols.length).toBe(config.r)
})

test('distribute weight over array', () => {

    const arr: number[][] = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ]

    const expected = [
        [0, 200, 400, 600, 800],
        [0, 400, 800, 1200, 1600],
        [0, 600, 1200, 1800, 2400],
        [0, 800, 1600, 2400, 3200],
        [0, 1000, 2000, 3000, 4000]
    ]

    const min = 0
    const max = 5000

    expect(distribute(arr, min, max)).toStrictEqual(expected)

})