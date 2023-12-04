import { expandCopiesWithsIds } from '@/composables/transaction/mintToken/transactionMintStatemine'
import { TokenToMint } from '@/composables/transaction/types'
import {
  assignIds,
  copiesToMint,
  expandCopies,
} from '@/composables/transaction/mintToken/utils'

const MOCK_API = {
  query: {
    nfts: {
      collection: () =>
        Promise.resolve({
          toHuman: () => ({ items: '0' }),
        }),
    },
  },
}
describe('transactionMintStatemine.ts functions', () => {
  describe('assignIds function', () => {
    it('should assign id correctly for a single token', () => {
      const tokens: TokenToMint[] = [
        { selectedCollection: { lastIndexUsed: 4 } },
      ]
      const result = assignIds(tokens, 4)
      expect(result).toEqual([
        { selectedCollection: { lastIndexUsed: 4 }, id: 5 },
      ])
    })

    it('should assign ids correctly for multiple tokens from the same collection', () => {
      const tokens: TokenToMint[] = [
        { selectedCollection: { alreadyMinted: 2, lastIndexUsed: 2 } },
        { selectedCollection: { alreadyMinted: 2, lastIndexUsed: 2 } },
        { selectedCollection: { alreadyMinted: 2, lastIndexUsed: 2 } },
      ]
      const result = assignIds(tokens, 2)
      expect(result).toEqual([
        { selectedCollection: { alreadyMinted: 2, lastIndexUsed: 2 }, id: 3 },
        { selectedCollection: { alreadyMinted: 2, lastIndexUsed: 2 }, id: 4 },
        { selectedCollection: { alreadyMinted: 2, lastIndexUsed: 2 }, id: 5 },
      ])
    })
  })

  describe('copiesToMint function', () => {
    it('should calculate the right number of copies to mint when max is not defined', () => {
      const token = {
        copies: 3,
        selectedCollection: {
          alreadyMinted: 5,
        },
      }
      const token2 = {
        copies: 3,
        selectedCollection: {
          alreadyMinted: 5,
          max: 0,
        },
      }
      expect(copiesToMint(token)).toBe(3)
      expect(copiesToMint(token2)).toBe(3)
    })

    it('should calculate the right number of copies to mint when max is defined and larger than the requested copies', () => {
      const token = {
        copies: 3,
        selectedCollection: {
          alreadyMinted: 5,
          max: 10,
        },
      }
      expect(copiesToMint(token)).toBe(3)
    })

    it('should calculate the right number of copies to mint when max is defined and less than the requested copies', () => {
      const token = {
        copies: 5,
        selectedCollection: {
          alreadyMinted: 5,
          max: 8,
        },
      }
      expect(copiesToMint(token)).toBe(3)
    })

    it('should return 1 for copies if no copies are specified', () => {
      const token = {
        selectedCollection: {
          alreadyMinted: 5,
        },
      }
      expect(copiesToMint(token)).toBe(1)
    })

    it('should return 1 for copies if less than 1 is specified', () => {
      const token = {
        copies: 0,
        selectedCollection: {
          alreadyMinted: 5,
        },
      }
      expect(copiesToMint(token)).toBe(1)
    })
  })

  describe('expandCopies function', () => {
    it('should expand copies correctly', () => {
      const tokens = [
        {
          copies: 3,
          name: 'test',
          postfix: true,
          selectedCollection: { alreadyMinted: 1, max: 10 },
        },
        {
          copies: 1,
          name: 'test2',
          postfix: true,
          selectedCollection: { alreadyMinted: 2, max: 10 },
        },
        {
          copies: 2,
          name: 'test3',
          postfix: true,
          selectedCollection: { alreadyMinted: 3, max: 5 },
        },
      ]

      const result = expandCopies(tokens)
      expect(result.length).toBe(6)
      expect(result[0].name).toBe('test #1')
      expect(result[1].name).toBe('test #2')
      expect(result[2].name).toBe('test #3')
      expect(result[3].name).toBe('test2')
      expect(result[4].name).toBe('test3 #1')
      expect(result[5].name).toBe('test3 #2')
    })

    it('should handle when max is not defined', () => {
      const tokens = [
        {
          copies: 3,
          name: 'test',
          postfix: true,
          selectedCollection: { alreadyMinted: 5 },
        },
        {
          copies: 1,
          name: 'test2',
          postfix: true,
          selectedCollection: { alreadyMinted: 7 },
        },
      ]

      const result = expandCopies(tokens)
      expect(result.length).toBe(4)
      expect(result[0].name).toBe('test #1')
      expect(result[1].name).toBe('test #2')
      expect(result[2].name).toBe('test #3')
      expect(result[3].name).toBe('test2')
    })
    it('should handle when max is 0', () => {
      const tokens = [
        {
          copies: 3,
          name: 'test',
          postfix: true,
          selectedCollection: { alreadyMinted: 5, max: 0 },
        },
        {
          copies: 1,
          name: 'test2',
          postfix: true,
          selectedCollection: { alreadyMinted: 5, max: 0 },
        },
      ]

      const result = expandCopies(tokens)
      expect(result.length).toBe(4)
      expect(result[0].name).toBe('test #1')
      expect(result[1].name).toBe('test #2')
      expect(result[2].name).toBe('test #3')
      expect(result[3].name).toBe('test2')
    })

    it('should handle when max is defined and less than the requested copies', () => {
      const tokens = [
        {
          copies: 5,
          name: 'test',
          postfix: true,
          selectedCollection: { alreadyMinted: 5, max: 8 },
        },
      ]

      const result = expandCopies(tokens)
      expect(result.length).toBe(3)
      expect(result[0].name).toBe('test #1')
      expect(result[1].name).toBe('test #2')
      expect(result[2].name).toBe('test #3')
    })

    it('should handle when copies is not specified', () => {
      const tokens = [
        { name: 'test', selectedCollection: { alreadyMinted: 5, max: 10 } },
      ]

      const result = expandCopies(tokens)
      expect(result.length).toBe(1)
      expect(result[0].name).toBe('test')
    })

    it('should handle when copies is less than 1', () => {
      const tokens = [
        {
          copies: 0,
          name: 'test',
          selectedCollection: { alreadyMinted: 5, max: 10 },
        },
      ]

      const result = expandCopies(tokens)
      expect(result.length).toBe(1)
      expect(result[0].name).toBe('test')
    })
    it('should not append index to name when postfix is false', () => {
      const tokens = [
        {
          copies: 3,
          name: 'test',
          postfix: false,
          selectedCollection: { alreadyMinted: 1, max: 10 },
        },
      ]

      const result = expandCopies(tokens)
      expect(result.length).toBe(3)
      expect(result[0].name).toBe('test')
      expect(result[1].name).toBe('test')
      expect(result[2].name).toBe('test')
    })
  })
  describe('expandCopiesWithsIds function', () => {
    it('should correctly prepare a single token with unique id', async () => {
      const token: TokenToMint = {
        name: 'test',
        selectedCollection: { alreadyMinted: 4, lastIndexUsed: 4 },
      }

      const item = {
        token,
      }

      const result = await expandCopiesWithsIds(item, MOCK_API)

      const expectedResult = [
        {
          name: 'test',
          selectedCollection: { alreadyMinted: 4, lastIndexUsed: 4 },
          id: 5,
        },
      ]
      expect(result).toEqual(expectedResult)
    })

    it('should correctly prepare a single token with unique id and copies', async () => {
      const token: TokenToMint = {
        name: 'test',
        copies: 3,
        postfix: true,
        selectedCollection: { alreadyMinted: 4, lastIndexUsed: 4 },
      }

      const item = {
        token,
      }

      const result = await expandCopiesWithsIds(item, MOCK_API)

      const expectedResult = [
        {
          name: 'test #1',
          copies: 3,
          postfix: true,
          selectedCollection: { alreadyMinted: 4, lastIndexUsed: 4 },
          id: 5,
        },
        {
          name: 'test #2',
          copies: 3,
          postfix: true,
          selectedCollection: { alreadyMinted: 4, lastIndexUsed: 4 },
          id: 6,
        },
        {
          name: 'test #3',
          copies: 3,
          postfix: true,
          selectedCollection: { alreadyMinted: 4, lastIndexUsed: 4 },
          id: 7,
        },
      ]

      expect(result).toEqual(expectedResult)
    })

    it('should correctly prepare an array of tokens with unique ids and no copies', async () => {
      const tokens: TokenToMint[] = [
        {
          name: 'test1',
          selectedCollection: { alreadyMinted: 2, lastIndexUsed: 3, id: 1234 },
        },
        {
          name: 'test2',
          selectedCollection: { alreadyMinted: 2, lastIndexUsed: 3, id: 1234 },
        },
        {
          name: 'test3',
          selectedCollection: { alreadyMinted: 2, lastIndexUsed: 3, id: 1234 },
        },
      ]

      const item = {
        token: tokens,
      }

      const result = await expandCopiesWithsIds(item, MOCK_API)

      const expectedResult = [
        {
          name: 'test1',
          selectedCollection: { alreadyMinted: 2, lastIndexUsed: 3, id: 1234 },
          id: 4,
        },
        {
          name: 'test2',
          selectedCollection: { alreadyMinted: 2, lastIndexUsed: 3, id: 1234 },
          id: 5,
        },
        {
          name: 'test3',
          selectedCollection: { alreadyMinted: 2, lastIndexUsed: 3, id: 1234 },
          id: 6,
        },
      ]

      expect(result).toEqual(expectedResult)
    })

    it('should correctly prepare an array of tokens with unique ids and some have copies', async () => {
      const selectedCollection = {
        alreadyMinted: 6,
        lastIndexUsed: 7,
        id: 1234,
      }
      const tokens: TokenToMint[] = [
        {
          name: 'test1',
          copies: 2,
          postfix: true,
          selectedCollection,
        },
        {
          name: 'test2',
          selectedCollection,
        },
        {
          name: 'test3',
          copies: 3,
          postfix: true,
          selectedCollection,
        },
      ]

      const item = {
        token: tokens,
      }

      const result = await expandCopiesWithsIds(item, MOCK_API)

      const expectedResult = [
        {
          name: 'test1 #1',
          copies: 2,
          postfix: true,
          selectedCollection,
          id: 8,
        },
        {
          name: 'test1 #2',
          copies: 2,
          postfix: true,
          selectedCollection,
          id: 9,
        },
        {
          name: 'test2',
          selectedCollection,
          id: 10,
        },
        {
          name: 'test3 #1',
          copies: 3,
          postfix: true,
          selectedCollection,
          id: 11,
        },
        {
          name: 'test3 #2',
          copies: 3,
          postfix: true,
          selectedCollection,
          id: 12,
        },
        {
          name: 'test3 #3',
          copies: 3,
          postfix: true,
          selectedCollection,
          id: 13,
        },
      ]

      expect(result).toEqual(expectedResult)
    })
  })
})
