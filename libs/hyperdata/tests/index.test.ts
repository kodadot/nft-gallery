import { describe, expect, it } from 'vitest'
import { OpenSeaAttribute, attributeFrom } from '../src'

describe('attributeFrom', () => {
  it(`should parse OpenSea Attribute correctly`, () => {
    const attribute: OpenSeaAttribute = {
      trait_type: 'NSFW',
      value: 1,
    }
    expect(attributeFrom(attribute)).toStrictEqual({
      display: '',
      trait: 'NSFW',
      value: '1',
    })
  })
})
