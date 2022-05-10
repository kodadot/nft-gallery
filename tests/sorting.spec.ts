import { sortItemListByIds } from '@/utils/sorting'

describe('sortItemListByIds TEST', (): void => {
  const itemList = [
    { id: '1' },
    { id: '4' },
    { id: '2' },
    { id: '3' },
    { id: '13' },
    { id: '23' },
    { id: '33' },
    { id: '43' },
  ]

  it('test case 1', async () => {
    const result = sortItemListByIds(itemList, ['1', '3'], 2)
    expect(result).toEqual([{ id: '1' }, { id: '3' }])
  })

  it('test case 2', async () => {
    const result = sortItemListByIds(itemList, ['1', '3', '2'], 2)
    expect(result).toEqual([{ id: '1' }, { id: '3' }])
  })

  it('test case 3', async () => {
    const result = sortItemListByIds(itemList, ['3', '1', '2', '4', '13'], 3)
    expect(result).toEqual([{ id: '3' }, { id: '1' }, { id: '2' }])
  })

  it('test case 3', async () => {
    const result = sortItemListByIds(itemList, ['3', '1', '2', '4', '13'], 5)
    expect(result).toEqual([
      { id: '3' },
      { id: '1' },
      { id: '2' },
      { id: '4' },
      { id: '13' },
    ])
  })
})
