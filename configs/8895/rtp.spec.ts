import { buildCache, spin } from "../../lib"
import { IStorage } from "../../lib/types"
import { config } from "./index"

describe('21 lines, with wild, free spins, RTP between 88 and 95', () => {
    for (let i = 0; i < config.m.length; i++) {
        const playUpToLines = i + 1

        it(`should be in range playing ${playUpToLines} lines`, () => {
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

            for (totalSpins = 0; totalSpins < maxSpins; totalSpins++) {
                totalRisk += storage.freeSpin && storage.freeSpin.total > 0 ? 0 : spinCost * playUpToLines
                const r = spin(playUpToLines, spinCost, config, cache, storage)
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
            expect(rtp).toBeGreaterThanOrEqual(.8800)
            expect(rtp).toBeLessThanOrEqual(.9500)
        })
    }
})
