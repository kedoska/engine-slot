import { sum } from "../lib"

test('sum', () => {
    expect(sum([1,2,3])).toBe(6)
})