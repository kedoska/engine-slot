import { buildCache, spin } from "../../lib"
import { IStorage } from "../../lib/types"
import { configure, weights8895, weights9297 } from "./index"

describe('RTP Configuration Tests', () => {

    const ww = [
        { 
            weights: weights8895, range: [.8800,.9500], test: true, maxSpins: 1_000_000, playUpToLines: 21
        },
        {
            weights: weights9297, range: [.9200,.9700], test: true, maxSpins: 1_000_000, playUpToLines: 21
        },
    ]

    for (const w of ww.filter(x => x.test)) {

        const config = configure(w.weights)
        const hasWild = config.wild && Number.isInteger(config.wild.index) && config.wild.index > -1

        let storage: IStorage = {}

        beforeEach(() => {
            // reset the storage for each test
            storage = {
                freeSpin: {
                    multiplier: 0,
                    symbols: 0,
                    total: 0,
                }
            }
        })
        const [sRange, eRange] = w.range || []

        describe(`${w.playUpToLines} lines of ${config.m.length}, ${hasWild && 'with wild, '}free spins, RTP between ${sRange} and ${eRange}`, () => {
            for (let i = 0; i < w.playUpToLines; i++) {

                it(`should be in range playing ${i+1} lines`, () => {
                    const cache = buildCache(config)

                    const spinCost = 1

                    const maxSpins = w.maxSpins
                    let totalSpins = 0
                    let totalRisk = 0
                    let finalPrize = 0
                    let totalFreeSpins = 0

                    for (totalSpins = 0; totalSpins < maxSpins; totalSpins++) {
                        totalRisk += storage.freeSpin && storage.freeSpin.total > 0 ? 0 : spinCost * w.playUpToLines
                        const r = spin(w.playUpToLines, spinCost, config, cache, storage)
                        storage = r.exitStorage
                        finalPrize += r.prize
                        totalFreeSpins += r.exitStorage.freeSpin?.total || 0
                    }

                    const rtp = finalPrize / totalRisk

                    expect(totalSpins).toBe(maxSpins)
                    expect(finalPrize).toBeGreaterThan(0)
                    expect(totalRisk).toBeGreaterThan(0)
                    expect(totalFreeSpins).toBeGreaterThan(0)
                    expect(totalRisk).toBeGreaterThan(finalPrize)
                    expect(rtp).toBeGreaterThanOrEqual(sRange)
                    expect(rtp).toBeLessThanOrEqual(eRange)
                })
            }
        })

    }
})
