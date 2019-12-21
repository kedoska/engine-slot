const {buildCache, grid, mask, decorate} = require("../lib")
const single_line_config = require("../config/single.line")
const multi_line_config = require("../config/multi.line")

test('immutability', () => {
    const a = JSON.stringify(multi_line_config)
    const cache = buildCache(multi_line_config)
    decorate(multi_line_config, mask(multi_line_config, grid(multi_line_config, cache)))
    expect(multi_line_config).toStrictEqual(JSON.parse(a))
})

test('build single line grid', () => {
    const cache = buildCache(single_line_config)
    const g = grid(single_line_config, cache)
    const m = mask(single_line_config, g)
    const { prize, lines } = decorate(single_line_config, m)
    expect(g.length).toBe(single_line_config.r)
})

test('build multi line grid', () => {
    const cache = buildCache(multi_line_config)
    const g = grid(multi_line_config, cache)
    const m = mask(multi_line_config, g)
    const { prize, lines } = decorate(multi_line_config, m)
    expect(g.length).toBe(multi_line_config.r)
})