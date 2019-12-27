import { IConfig, IGrid, ILines, IStorage } from './types'

export const r = (max: number): number => Math.floor(Math.random() * max) + 1

export const select = (arr: number[] = [], n: number = 0): number => {
    let v: number = 0
    for (let i = 0; i < arr.length; i++) {
        v += arr[i]
        if (v < n) {
            continue
        }
        return i
    }
    throw Error(`could not select a number: in ${arr.join('|')} using "${n}"`)
}

export const grid = (config: IConfig, cache: number[]): IGrid => {

    const fsi = config.freeSpin && Number.isInteger(config.freeSpin.index) ? config.freeSpin.index : -1

    const symbols: number[][] = []
    const freeSpin = {
        symbols: 0,
        total: 0,
        multiplier: 1,
    }

    // At this point we want to distribute the symbols across the grid.
    for (let row = 0; row < config.r; row++) {
        symbols.push([])
        for (let reel = 0; reel < config.w.length; reel++) {
            const symbol = select(config.w[reel], r(cache[reel]))

            if (fsi > -1 && symbol === fsi) {
                // Free Spin Symbols are across the grid not by line.
                freeSpin.symbols++
            }

            symbols[row].push(symbol)
        }
    }

    if (fsi > -1 && freeSpin.symbols > 0) {
        // Free spin won on the current spin must be considered in the next spin.
        // Current game should NOT be affected by the free spin.
        const condition = config.freeSpin?.conditions.find(x => x.count === freeSpin.symbols)
        if (condition && condition.total) {
            freeSpin.total = condition.total
            freeSpin.multiplier = condition.multiply || 1 // multiplier could be 0
        }
    }

    return {
        symbols,
        freeSpin,
    }
}

export const mask = (config: IConfig, filledGrid: IGrid): number[][] => {
    const ll = config.m.map(x => x.slice())

    for (let line = 0; line < config.m.length; line++) {
        const l = ll[line]
        for (let reel = 0; reel < l.length; reel++) {
            const row = l[reel]
            ll[line][reel] = filledGrid.symbols[row][reel]
        }
    }
    return ll
}

export const processLines = (config: IConfig, filledMask: number[][] = [[]], storage: IStorage): ILines => {
    const result: ILines = {
        lines: [],
        prize: 0,
    }
    const { wild } = config
    const wi = wild && Number.isInteger(wild.index) ? wild.index : -1

    for (let i = 0; i < filledMask.length; i++) {
        const line = filledMask[i]
        let wc = 0 // wild count
        let combo = 0
        let symbol = -1

        if (wi > -1) {
            for (const s of line) {
                // select the first symbol in this line
                // it must be different then a wild symbol
                symbol = s
                if (symbol !== wi) {
                    break
                }
            }
        } else {
            // when wild is not defined, the first symbol will be always the
            // symbol of the combo.
            symbol = line[0]
        }

        for (const s of line) {
            // consider wild if defined.
            // Wild takes the value of the combo's symbol.
            const isWild = wi > -1 && wi === s
            if (isWild) {
                wc++
                combo++
                continue
            }

            if (s !== symbol) {
                break
            }
            combo++
            continue
        }
        const prizesPerSymbol = config.p[symbol]
        if (prizesPerSymbol) {
            // the multiplier, from the prev session, to be applied to the current session.
            const { multiplier = 1 } = storage

            const prize = prizesPerSymbol[combo - 1] * multiplier
            if (prize) {
                result.prize += prize
                result.lines.push({ i, combo, prize, wc, ss: filledMask[i] })
            }
        }
    }
    return result
}

export const sum = (arr: number[] = []) => arr.reduce((m, v) => m + v, 0)

// build cache returns an array representing, for each w in config
// the sum of all the symbols w.
export const buildCache = (config: IConfig) => config.w.map(sum)
