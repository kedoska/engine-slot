import { IConfig } from "../../lib/types"
import { standardLines, standardPayout } from ".."

export const weights8895: number[][] = [
    [47, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 8, 5],
    [47, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 5, 5],
    [49, 39, 28, 26, 9, 6, 6, 13, 12, 6, 2, 5, 5],
    [49, 41, 35, 30, 13, 6, 6, 6, 6, 4, 2, 5, 5],
    [49, 41, 35, 30, 22, 11, 8, 2, 2, 2, 2, 2, 5],
]

export const weights9297: number[][] = [
    [45, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 8, 5],
    [45, 38, 18, 26, 9, 7, 6, 20, 12, 11, 2, 6, 5],
    [49, 42, 28, 26, 9, 6, 6, 13, 12, 6, 2, 5, 5],
    [49, 41, 35, 30, 13, 6, 6, 6, 6, 4, 2, 5, 5],
    [49, 41, 35, 30, 22, 11, 8, 2, 2, 2, 2, 2, 5],
]

export const configure = (weights: number[][]): IConfig => ({
    freeSpin: {
        conditions: [
            { count: 2, multiply: 0, total: 5 },
            { count: 3, multiply: 0, total: 10 },
            { count: 4, multiply: 0, total: 15 },
            { count: 5, multiply: 0, total: 20 },
        ],
        index: 12,
    },
    m: standardLines,
    p: standardPayout,
    r: 3,
    w: weights,
    wild: {
        index: 11,
    }
})