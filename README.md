<p align="center">
    <img src="https://user-images.githubusercontent.com/11739105/71529109-b389f100-28a8-11ea-9e16-1a4d0a8ec49b.png" alt="engine-blackjack" style="max-width:100%;">
</p>

A NodeJs or Web library to _create_ slot machines.

### Philosophy

 * **configurable** any number of reels/rows must be possible
 * **testable** payout, symbols and lines and RTP must be testable 
 * **composable** no complex classes or states, all dependencies are injected
 * **less code** when it gets cryptographic, just write the comment

### Motivation

I've been working with slots since half of a decad right now. Most of the engines are (_perfectly working in production_) very complex and full of death features that honestly makes the entire projects annoying to read and work with.

With this side-project, I want to implement some of the functionalities that I have been working with and try to understand how to create better slots in the future.

## How it works

At the very basics, a configuration file is required. Understand the configuration file, which can be a simple _JSON file_ **implementing the `IConfig` interface**, which is key to run execute the slot.

## Functionalities

- [x] Create any grid layout you want 5x3, 3x3 NxN
- [x] Configure the payout on each symbol
- [x] Add any line and relative path you like (on top of the grid layout)
- [x] `Wild` Symbols (to complete combinations)
- [x] `Free Spins` Symbols
- [x] `Multiplier` Symbols
- [ ] `Scatter` Symbols


## Life Cycle

 * The configuration produces the grid
 * The grid produces the prizes for the current spin and the future storage
 * The post grid processes considers the previous storage to generate the exit state

### A workflow, without persistent state

 1. create or load the configuration `const config: IConfig = ...`
 2. create a cached configuration `const cache = buildCache(config)`
 3. load the storage (state relative to your context) `const storage: IStorage = {}`
 4. generate the grid (random occurs here) `let spin: IGrid = grid(config, cache)`
 5. create the line mask: `let lines = mask(config, spin)`
 6. process the grid across lines `const result: IResult = execute(1, config, spin, lines, storage)`
 7. repeat `4` -> `5` -> `6` until is necessary...

In the above example the storage is an `empty object` that has no previous state to pass to the `process function`

### A workflow, with persistent state (Example Free Spins)

In this case, we assume the `result: IResult`, because of the `config: IConfig`, produces some *Free Spins*.
Before to go ahead, please consider that Free spins have some basic, built-in rules:

 - free spin is FS;
 - FSs depends on symbols;
 - symbols that give FSS are across the grid, never considered on the line;
 - FSs can have multiplier (default value `1`) that will boosts the prizes gained over FS;
 - FS is applied on the next spin, the spin that won FS

> If you are interested in how free spins are handled, check out the `IConfig` interface and the `grid` function.

 1. create or load the configuration `const config: IConfig = ...`
 2. create a cached configuration `const cache = buildCache(config)`
 3. load the storage (state relative to your context) `const storage: IStorage = {}`
 4. generate the grid (random occurs here) `let spin: IGrid = grid(config, cache)`
 5. create the line mask: `let lines = mask(config, spin)`
 6. process the grid across lines `let result: IResult = execute(1, config, spin, lines, storage)`
 7. repeat `4` -> `5` -> and `6` but this time override the last parameter of the `process` function (the `storage`) with the `result.exitStorage`

The `IResult.exitStorage` implements the `IStorage` interface, which is mutated during the `process` function. In a non-test environment you probably are storing the `result`, associated to some _user_ information, in order to restore the state of the slot machine, continuing with the _game_.


# License

engine-slot
Copyright (C) 2016 Marco Casula

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; version 2 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

# Credits

Thanks @webpty for logos
