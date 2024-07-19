import { shouldLazyLoad } from '../../utils/grid'

describe('GRID TEST', (): void => {
  it('TEST shouldLazyLoad', () => {
    const limit = 40
    const cols = 3
    const skipRows = 3

    expect(shouldLazyLoad({ index: 0, limit, cols, skipRows })).toBe(false)
    expect(shouldLazyLoad({ index: 9, limit, cols, skipRows })).toBe(true)
    expect(shouldLazyLoad({ index: 48, limit, cols, skipRows })).toBe(false)
    expect(shouldLazyLoad({ index: 49, limit, cols, skipRows })).toBe(true)
  })
})
