import { URL_PREFIXES } from '@kodadot1/vuex-options'
const withPrefix = /-/

describe('PREFIX TEST', (): void => {
  let prefixes: RegExp[]
  const prefixMatcher = (routeName: string, prefix = 'rmrk'): string => {
    if (
      !RegExp(`^${prefix}`).test(routeName) &&
      prefixes.some((x) => x.test(routeName))
    ) {
      return routeName.split(withPrefix)[0]
    }

    return ''
  }

  beforeAll(async () => {
    prefixes = URL_PREFIXES.map((option) => option.value as string).map(
      (value) => RegExp(`^${value}`)
    )
  })

  it('can correctly match /rmrk/create', () => {
    const routeName = 'rmrk-create'
    const result = prefixMatcher(routeName)
    expect(result).toBe('')
  })

  it('can correctly match /spotlight', () => {
    const routeName = 'spotlight'
    const result = prefixMatcher(routeName)
    expect(result).toBe('')
  })

  it('can correctly match /statemine/create', () => {
    const routeName = 'statemine-create'
    const result = prefixMatcher(routeName)
    expect(result).toBe('statemine')
  })
})
