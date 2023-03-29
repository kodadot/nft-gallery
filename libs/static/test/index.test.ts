import { describe, expect, it } from 'vitest'
import { APOLLO_ENDPOINTS, INDEXERS } from '../src'

describe('Endpoints', () => {
  for (const key of Object.keys(INDEXERS)) {
    it(`should parse SQUID::${key} to APOLLO_INDEXER correctly`, () => {
      expect(APOLLO_ENDPOINTS[key]).toStrictEqual({
        httpEndpoint: INDEXERS[key],
      })
    })
  }
})
