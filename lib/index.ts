import { Config, Result } from "./types"

export const r = (max: number): number => Math.floor(Math.random() * max) + 1

export const select = (arr: Array<number> = [], n: number = 0): number => {
    let v: number = 0
    for (let i = 0; i < arr.length; i++) {
        v += arr[i]
        if (v < n) {
            continue
        }
        return i
    }
    throw `could not select a number: in ${arr.join('|')} using "${n}"`
}

export const grid = (config: Config, cache: Array<number>): Array<number[]> => {
    const grid: Array<number[]> = []
    for (let row = 0; row < config.r; row++) {
        grid.push([])
        for (let reel = 0; reel < config.w.length; reel++) {
            grid[row].push(select(config.w[reel], r(cache[reel])))
        }
    }
    return grid
}

export const mask = (config: Config, grid: Array<number[]> = [[]]): Array<number[]> => {
    var ll = config.m.map(x => x.slice())

    for (let line = 0; line < config.m.length; line++) {
        const l = ll[line]
        for (let reel = 0; reel < l.length; reel++) {
            const row = l[reel]
            ll[line][reel] = grid[row][reel]
        }
    }
    return ll
}

export const decorate = (config: Config, mask: Array<number[]> = [[]]): Result => {
    const r: Result = {
        prize: 0,
        lines: [],
    }
    const { wild } = config
    const wi = wild && wild.index ? wild.index : -1

    for (let i = 0; i < mask.length; i++) {
        const line = mask[i]
        let wc = 0 // wild count
        let combo = 0
        let symbol = -1

        if (wi > -1) {
            for (let s = 0; s < line.length; s++) {
                // select the first symbol in this line
                // it must be different then a wild symbol
                symbol = line[s]
                if (symbol !== wi) {
                    break
                }
            }
        } else {
            // when wild is not defined, the first symbol will be always the
            // symbol of the combo.
            symbol = line[0]
        }

        for (let s = 0; s < line.length; s++) {

            // consider wild if defined.
            // Wild takes the value of the combo's symbol.
            const isWild = wi > -1 && wi === line[s]
            if (isWild) {
                wc++
                combo++
                continue
            }

            if (line[s] !== symbol) {
                break
            }
            combo++
            continue
        }
        const prize = config.p[symbol][combo - 1]

        if (prize) {
            r.prize += prize
            r.lines.push({ i, combo, prize, wc, ss: mask[i] })
        }
    }
    return r
}

export const sum = (arr: Array<number> = []) => arr.reduce((m, v) => m + v, 0)

// build cache returns an array representing, for each w in config
// the sum of all the symbols w.
export const buildCache = (config: Config) => config.w.map(sum)
