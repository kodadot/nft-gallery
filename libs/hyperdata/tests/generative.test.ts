import { describe, expect, it } from 'vitest'
import { FXHashMetadata, GenArt, generativeFrom } from '../src'
import fxhash from './examples/fxhash.json'

describe('generativeFrom', () => {
  it(`should parse FXhash metadata to Content correctly`, () => {
    const metadata = fxhash as FXHashMetadata
    const res: GenArt = {
      uri: metadata.generativeUri || metadata.generatorUri || '',
      previewHash: metadata.previewHash,
      previewParam: 'fxhash',
      capture: metadata.capture || {},
      settings: metadata.settings || {},
    }

    expect(generativeFrom(metadata)).toStrictEqual(res)
  })
})
