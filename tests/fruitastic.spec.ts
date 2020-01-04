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
        index: 11,
    },
    m: [
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2],
        [0, 1, 2, 1, 0],
        [2, 1, 0, 1, 2],
        [0, 0, 1, 0, 0],
        [2, 2, 1, 2, 2],
        [1, 0, 0, 0, 1],
        [1, 2, 2, 2, 1],
        [1, 1, 0, 1, 1],
        [1, 1, 2, 1, 1],
        [2, 2, 2, 1, 0],
        [0, 0, 0, 1, 2],
        [2, 1, 0, 0, 0],
        [0, 1, 2, 2, 2],
        [0, 2, 0, 2, 0],
        [2, 0, 2, 0, 2],
        [1, 0, 1, 0, 1],
        [1, 2, 1, 2, 1],
        [0, 1, 0, 1, 0],
        [2, 1, 2, 1, 2],
    ],
    p: [
        [0, 0, 1, 10, 50],            // first
        [0, 0, 5, 15, 20],         // second
        [0, 0, 10, 20, 150],
        [0, 0, 15, 40, 200],
        [0, 0, 20, 50, 300],
        [0, 0, 25, 100, 600],
        [0, 0, 40, 200, 1000],
        [0, 1, 50, 300, 1500],
        [0, 5, 100, 400, 2500],
        [0, 10, 150, 600, 5000],
        [0, 20, 200, 1000, 5000],
        [0, 0, 0, 0, 0],
    ],
    r: 3,
    w: [
        [47, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 5],
        [47, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 5],
        [49, 39, 28, 26, 9, 6, 6, 13, 12, 6, 2, 5],
        [49, 41, 35, 30, 13, 6, 6, 6, 6, 4, 2, 5],
        [49, 41, 35, 30, 22, 11, 8, 2, 2, 2, 2, 5],
    ],
    wild: {
        index: 11,
    }
}

test('21 lines, with wild, free spins, RTP between 88 and 95', () => {

    const cache = buildCache(config)

    const spinCost = 1
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
    const wonOverLinesTimes: number[] = new Array(config.m.length).fill(0)
    const wonOverLinesPrizes: number[] = new Array(config.m.length).fill(0)
    const wonOverComboTimes: number[] = new Array(config.p[0].length).fill(0)
    const wonOverComboPrizes: number[] = new Array(config.p.length).fill(0)


    for (totalSpins = 0; totalSpins < maxSpins; totalSpins++) {
        totalRisk += storage.freeSpin && storage.freeSpin.total > 0 ? 0 : spinCost * config.m.length
        const r = spin(spinCost, config, cache, storage)
        storage = r.exitStorage
        finalPrize += r.prize
        totalFreeSpins += r.exitStorage.freeSpin?.total || 0
        if (r.prize) {

            wonOverLinesTimes[r.lines.length - 1] ++
            // stats across lines for each spin
            for (let li = 0; li < r.lines.length; li++) {
                if (!r.lines[li].prize) {
                    continue
                }
                wonOverLinesPrizes[li] += r.lines[li].prize
                wonOverComboTimes[r.lines[li].combo - 1]++
                wonOverComboPrizes[r.lines[li].ss[0]] += r.lines[li].prize
            }
        } else {

        }
    }

    const rtp = finalPrize / totalRisk

    expect(totalSpins).toBe(maxSpins)
    expect(finalPrize).toBeGreaterThan(0)
    expect(totalRisk).toBeGreaterThan(0)
    expect(totalFreeSpins).toBeGreaterThan(0)
    expect(totalRisk).toBeGreaterThan(finalPrize)
    expect(rtp).toBeGreaterThanOrEqual(.8800)
    expect(rtp).toBeLessThanOrEqual(.9500)
})

