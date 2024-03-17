import { uidCrypto, uidMath, uidMathDate } from '../utils/randomize'

const attemps = 100
// const attemps = 10_000

// uidMathDate() has less randomness in its format because it has a date prefix (yyMM). However, it has a slightly higher chance than the others of generating a non-unique ID because of the date prefix.

it.each([uidCrypto, uidMath, uidMathDate])('generate unique id', (random) => {
  const ids = new Set<string>()
  const length = new Set<number>()

  // eslint-disable-next-line no-restricted-syntax
  for (let index = 0; index < attemps; index++) {
    const id = random()
    ids.add(id)
    length.add(id.length)
  }

  expect(ids.size).toBe(attemps)
  expect(length.has(9)).toEqual(true)
})
