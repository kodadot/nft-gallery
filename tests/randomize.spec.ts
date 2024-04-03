import { uidCrypto, uidMathDate } from '../utils/randomize'

const users = 100 // concurrent users

// uidMathDate() has less randomness in its format because it has a date prefix (yyMM). However, it has a slightly higher chance than the others of generating a non-unique ID because of the date prefix.

// for more than 1k concurrent users, prefer uidCrypto() or uidMath() to ensure uniqueness

it.each([uidCrypto, uidMathDate])('generate unique id', (random) => {
  const ids = new Set<string>()

  // eslint-disable-next-line no-restricted-syntax
  for (let index = 0; index < users; index++) {
    const id = random()
    ids.add(id)
  }

  expect(ids.size).toBe(users)
})
