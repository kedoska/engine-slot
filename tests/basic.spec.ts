import { buildCache, grid, sum } from "../lib"
import { IConfig } from "../lib/types"

test('grid', () => {
    const config:IConfig = {
        m: [
            [0,0,0]
        ],
        p: [
            [0,0,0]
        ],
        r: 1,
        w: [
            [5, 3, 2],
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

test('sum', () => {
    expect(sum([1, 2, 3])).toBe(6)
})