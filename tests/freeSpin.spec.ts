import { buildCache, grid } from "../lib"
import { IConfig } from "../lib/types"

test('grid having free spins', () => {
    const config:IConfig = {
        freeSpin: {
            conditions: [
                {count: 1, multiply: 0, total: 10},
                {count: 2, multiply: 0, total: 50},
                {count: 3, multiply: 0, total: 100},
            ],
            index: 2,
        },
        m: [
            [0,0,0]
        ],
        p: [
            [0,0,0]
        ],
        r: 1,
        w: [
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 1],
        ],
    }
    const cache = buildCache(config)
    expect(cache.length).toBe(3)
    expect(cache).toStrictEqual([1, 1, 1])

    const g = grid(config, cache)

    expect(g.symbols.length).toBe(config.r)
    expect(g.freeSpin.total).toBe(100)
    // multiplier is converted to 1 to avoid `*0` later in `processLines`
    expect(g.freeSpin.multiplier).toBe(1)
    expect(g.freeSpin.symbols).toBe(3)
})