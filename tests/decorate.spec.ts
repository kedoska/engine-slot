import { decorate } from "../lib"
import { IConfig } from "../lib/types"

test('5 reels; 1 row; 3 symbols per reel', () => {
    const bananasW = 10
    const kiwisW = 10
    const orangesW = 10

    const config: IConfig = {
        r: 1,
        w: [
            [bananasW, kiwisW, orangesW],  // first reel
            [bananasW, kiwisW, orangesW],  // second reel
            [bananasW, kiwisW, orangesW],  // third reel
        ],
        m: [
            [0, 0, 0, 0, 0],            // line definition
                                        // only one line (LTR) is possible
        ],
        p: [
            [0, 0, 1],                  // 1 banana pays      0
                                        // 2 bananas pays     0
                                        // 3 bananas pays     1
            [0, 2, 5],                  // 1 kiwi pays        0
                                        // 2 kiwis pays       2
                                        // 3 kiwis pays       5
            [10, 20, 100],              // 1 orange pays     10
                                        // 2 oranges pays    20
                                        // 3 oranges pays   100
        ]
    }

    const banana = 0
    const kiwi = 1
    const orange = 2

    expect(decorate(config, [[banana, kiwi, orange]]).prize).toBe(0)
    expect(decorate(config, [[banana, banana, orange]]).prize).toBe(0)
    expect(decorate(config, [[banana, banana, banana]]).prize).toBe(1)

    expect(decorate(config, [[kiwi, kiwi, orange]]).prize).toBe(2)
    expect(decorate(config, [[orange, kiwi, kiwi]]).prize).toBe(10)

    expect(decorate(config, [[orange, orange, kiwi]]).prize).toBe(20)
    expect(decorate(config, [[orange, orange, orange]]).prize).toBe(100)
})