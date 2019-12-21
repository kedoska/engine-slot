const r = (max) => Math.floor(Math.random() * max) + 1 

const select = (arr = [], n = 0) => {
    let v = 0
    for (let i = 0; i < arr.length; i++) {
        v += arr[i]
        if (v < n) {
            continue
        }
        return i
    }
}

module.exports.select = select

module.exports.grid = (config, cache) => {
    const grid = []
    for (let row = 0; row < config.r; row++) {
        grid.push([])
        for (let reel = 0; reel < config.w.length; reel++) {
            grid[row].push(select(config.w[reel], r(cache[reel])))
        }
    }
    return grid
}

module.exports.mask = (config, grid = [[]]) => {
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

module.exports.decorate = (config, mask = [[]]) => {
    const r = {
        prize: 0,
        lines: [],
    }
    const ws = config.w[0].length - 1 // wild symbol

    for (let i = 0; i < mask.length; i++) {
        const line = mask[i]
        let wc = 0 // wild count
        let combo = 0
        let symbol = -1
        for (let s = 0; s < line.length; s++) {
            // select the first symbol in this line
            // it must be different then a ws (wild symbol)
            symbol = line[s]
            if (symbol !== ws) {
                break
            }
        }
        for (let s = 0; s < line.length; s++) {

            const isWild = ws === line[s]
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
            r.lines.push(mask[i].concat({ i, combo, prize, wc }))
        }
    }
    return r
}

const sum = (arr = []) => arr.reduce((m, v) => m + v, 0)

// build cache returns an array representing, for each w in config
// the sum of all the symbols w.
module.exports.buildCache = (config) => config.w.map(sum)
