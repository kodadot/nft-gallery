import transform from '@/utils/urlTransformer'

describe('URL TRANSFORMER TEST', (): void => {
  describe('For Singular', (): void => {
    it('can correctly transform profile', () => {
      const profile =
        'https://singular.rmrk.app/space/JHMAL5CyvxWc3Ud42QxRUTpSnUa4m56mRSzPK69d1TU8NG7'
      const transformed = transform(profile)
      expect(transformed).toBe(
        '/rmrk/u/JHMAL5CyvxWc3Ud42QxRUTpSnUa4m56mRSzPK69d1TU8NG7'
      )
    })

    it('can correctly transform nft', () => {
      const nft =
        'https://singular.rmrk.app/collectibles/10249854-FC77C33AB229A2056A-BTFLSUZANN-BEAUTIFUL_SUZANNE_13-0000000000000013'
      const transformed = transform(nft)
      expect(transformed).toBe(
        '/rmrk/detail/10249854-FC77C33AB229A2056A-BTFLSUZANN-BEAUTIFUL_SUZANNE_13-0000000000000013'
      )
    })

    it('can correctly transform collection', () => {
      const collection =
        'https://singular.rmrk.app/collections/FC77C33AB229A2056A-BTFLSUZANN'
      const transformed = transform(collection)
      expect(transformed).toBe('/rmrk/collection/FC77C33AB229A2056A-BTFLSUZANN')
    })

    it('can correctly handle empty URL', () => {
      const collection = ''
      const transformed = transform(collection)
      expect(transformed).toBe('')
    })

    it('should return empty string when the value is not correct', () => {
      const collection = 'kkdot'
      const transformed = transform(collection)
      expect(transformed).toBe('')
    })
  })
})
