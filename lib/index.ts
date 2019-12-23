import { IConfig, IResult } from './types'

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

export const grid = (config: IConfig, cache: number[]): number[][] => {
    const result: number[][] = []
    for (let row = 0; row < config.r; row++) {
        result.push([])
        for (let reel = 0; reel < config.w.length; reel++) {
            result[row].push(select(config.w[reel], r(cache[reel])))
        }
    }
    return result
}

export const mask = (config: IConfig, filledGrid: number[][] = [[]]): number[][] => {
    const ll = config.m.map(x => x.slice())

    for (let line = 0; line < config.m.length; line++) {
        const l = ll[line]
        for (let reel = 0; reel < l.length; reel++) {
            const row = l[reel]
            ll[line][reel] = filledGrid[row][reel]
        }
    }
    return ll
}

export const decorate = (config: IConfig, filledMask: number[][] = [[]]): IResult => {
    const result: IResult = {
        lines: [],
        prize: 0,
    }
    const { wild } = config
    const wi = wild && wild.index ? wild.index : -1

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

            const prize = prizesPerSymbol[combo - 1]
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
