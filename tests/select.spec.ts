import { select } from "../lib"

test('first symbol with 1', () => expect(select([10,10,10,10,10], 1)).toBe(0))

test('first symbol with exact value', () => expect(select([10,10,10,10,10], 10)).toBe(0))

test('first symbol withing range', () => expect(select([10,10,10,10,10], 8)).toBe(0))

test('second symbol with exact value', () => expect(select([10,10,10,10,10], 11)).toBe(1))

test('second symbol withing range', () => expect(select([10,10,10,10,10], 15)).toBe(1))