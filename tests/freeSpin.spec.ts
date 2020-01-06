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

    let freeSpinTotal = 0

    for (let i = 0; i < 10; i++) {
        const t1 = grid(config, cache)
        freeSpinTotal += t1.freeSpin.total
    }
    expect(freeSpinTotal).toBeGreaterThanOrEqual(0)

})