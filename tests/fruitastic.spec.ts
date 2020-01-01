import { buildCache, spin } from "../lib"
import { IConfig, IStorage } from "../lib/types"

const config: IConfig = {
    freeSpin: {
        conditions: [
            { count: 2, multiply: 0, total: 5 },
            { count: 3, multiply: 0, total: 10 },
            { count: 4, multiply: 0, total: 15 },
            { count: 5, multiply: 0, total: 20 },
        ],
        index: 10,
    },
    m: [
        [1, 1, 1, 1, 1,],
        [0, 0, 0, 0, 0,],
        [2, 2, 2, 2, 2,],
        [0, 1, 2, 1, 0,],
        [2, 1, 0, 1, 2,],
        [0, 0, 1, 2, 2,],
        [2, 2, 1, 0, 0,],
        [1, 0, 0, 1, 0,],
        [2, 1, 2, 2, 1,],
        [1, 0, 1, 2, 1,],
        [1, 2, 1, 0, 1,],
        [0, 1, 0, 0, 1,],
        [1, 2, 2, 1, 2,],
        [0, 2, 0, 2, 0,],
        [2, 0, 2, 0, 2,],
        [0, 1, 1, 1, 0,],
        [2, 1, 1, 1, 2,],
        [1, 0, 2, 0, 1,],
        [1, 2, 0, 2, 1,],
        [0, 2, 2, 2, 0,],
        [2, 0, 0, 0, 2,]
    ],
    p: [
        [0, 0, 0, 0, 1],            // first
        [0, 0, 5, 15, 100],         // second
        [0, 0, 10, 20, 150],
        [0, 0, 15, 40, 200],
        [0, 0, 20, 50, 300],
        [0, 0, 25, 100, 600],
        [0, 0, 40, 200, 1000],
        [0, 1, 50, 300, 1500],
        [0, 5, 100, 400, 2500],
        [0, 10, 150, 600, 5000],
        [0, 1, 5, 50, 15],
        [0, 20, 200, 1000, 5000],
    ],
    r: 3,
    w: [
        [47, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 5],
        [47, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 5],
        [49, 39, 28, 26, 9, 6, 6, 13, 12, 6, 2, 5],
        [49, 41, 35, 30, 13, 6, 6, 6, 6, 4, 2, 3],
        [49, 41, 35, 30, 22, 11, 8, 2, 2, 2, 2, 1],
    ],
    wild: {
        index: 10,
    }
}

test('21 lines, with wild, free spins, RTP between 88 and 95', () => {
    
    const cache = buildCache(config)

    const maxSpins = 1000000
    let totalSpins = 0
    let totalRisk = 0
    let finalPrize = 0
    let totalFreeSpins = 0

    let storage: IStorage = {
        freeSpin: {
            multiplier: 0,
            symbols: 0,
            total: 0,
        }
    }

    for (totalSpins = 0; totalSpins < maxSpins; totalSpins++) {
        const risk = storage.freeSpin && storage.freeSpin.total > 0 ? 0 : 1
        const r = spin(risk, config, cache, storage)
        storage = r.exitStorage
        finalPrize += r.prize
        totalRisk += risk
        totalFreeSpins += r.exitStorage.freeSpin?.total || 0
    }

    const rtp = finalPrize / totalRisk

    expect(totalSpins).toBe(maxSpins)
    expect(finalPrize).toBeGreaterThan(0)
    expect(totalRisk).toBeGreaterThan(0)
    expect(totalRisk).toBeGreaterThan(finalPrize)
    expect(totalFreeSpins).toBeGreaterThan(0)
    expect(totalSpins).toBeGreaterThan(totalRisk)
    expect(rtp).toBeGreaterThanOrEqual(.8800)
    expect(rtp).toBeLessThanOrEqual(.9500)
})

