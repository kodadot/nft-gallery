import { describe, expect, it } from 'vitest'
import { TezosMetadata, contentFrom } from '../src'
import fxhash from './examples/fxhash.json'

describe('contentFrom', () => {
  it(`should parse FXhash metadata to Content correctly`, () => {
    const metadata = fxhash as TezosMetadata
    expect(contentFrom(metadata)).toStrictEqual({
      name: metadata.name,
      description: metadata.description,
      image: metadata.displayUri,
      animationUrl: metadata.artifactUri,
      attributes: [],
      externalUrl: metadata.externalUri,
      tags: [],
      thumbnail: metadata.thumbnailUri,
      type: '',
    })
  })
})
