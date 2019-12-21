export interface Config {
    r: number;
    w: Array<number[]>;
    m: Array<number[]>;
    p: Array<number[]>;
}

export interface ProcessedLine {
    i: number
    combo: number
    prize: number
    wc: number
    ss: Array<number>
}

export interface Result {
    prize: number
    lines: Array<ProcessedLine>
}