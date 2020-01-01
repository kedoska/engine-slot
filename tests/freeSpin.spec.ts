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
            [1, 1, 1],
            [1, 1, 1],
            [10000, 10000, 10000],
        ],
    }
    const cache = buildCache(config)
    const t1 = grid(config, cache)
    const t2 = grid(config, cache)
    const t3 = grid(config, cache)
    const t4 = grid(config, cache)

    expect(t1.freeSpin.total).toBeGreaterThanOrEqual(10)
    expect(t1.freeSpin.multiplier).toBe(1)
    expect(t1.freeSpin.symbols).toBeGreaterThanOrEqual(1)

    expect(t2.freeSpin.total).toBeGreaterThanOrEqual(10)
    expect(t2.freeSpin.multiplier).toBe(1)
    expect(t2.freeSpin.symbols).toBeGreaterThanOrEqual(1)

    expect(t3.freeSpin.total).toBeGreaterThanOrEqual(10)
    expect(t3.freeSpin.multiplier).toBe(1)
    expect(t3.freeSpin.symbols).toBeGreaterThanOrEqual(1)

    expect(t4.freeSpin.total).toBeGreaterThanOrEqual(10)
    expect(t4.freeSpin.multiplier).toBe(1)
    expect(t4.freeSpin.symbols).toBeGreaterThanOrEqual(1)
})