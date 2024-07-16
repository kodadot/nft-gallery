import { uidCrypto } from '../utils/randomize'

const users = 100 // concurrent users

// uidMathDate() has less randomness in its format because it has a date prefix (yyMM). However, it has a slightly higher chance than the others of generating a non-unique ID because of the date prefix.
// for more than 1k concurrent users, prefer uidCrypto() or uidMath() to ensure uniqueness
const methods = [uidCrypto]

it.each(methods)('generate unique id', (random) => {
  const ids = new Set<string>()

  for (let index = 0; index < users; index++) {
    const id = random()
    ids.add(id)
  }

  expect(ids.size).toBe(users)
})
