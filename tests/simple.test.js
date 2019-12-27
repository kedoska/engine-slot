const {buildCache, grid, mask, processLines} = require("../lib")
const single_line_config = require("../config/single.line")
const multi_line_config = require("../config/multi.line")

const storage = {multiplier: 1}

test('immutability', () => {
    const a = JSON.stringify(multi_line_config)
    const cache = buildCache(multi_line_config)
    processLines(multi_line_config, mask(multi_line_config, grid(multi_line_config, cache)), storage)
    expect(multi_line_config).toStrictEqual(JSON.parse(a))
})

test('build single line grid', () => {
    const cache = buildCache(single_line_config)
    const g = grid(single_line_config, cache)
    const m = mask(single_line_config, g)
    const { prize, lines } = processLines(single_line_config, m, storage)
    expect(g.symbols.length).toBe(single_line_config.r)
})

test('build multi line grid', () => {
    const cache = buildCache(multi_line_config)
    const g = grid(multi_line_config, cache)
    const m = mask(multi_line_config, g)
    const { prize, lines } = processLines(multi_line_config, m, storage)
    expect(g.symbols.length).toBe(multi_line_config.r)
})