import {
  massMintParser,
  processFiles,
  processMatchAllSyntax,
  processRangeSyntax,
  replaceIndex,
} from '@/components/rmrk/Create/mintUtils'

describe.skip('MASS MINT TEST', () => {
  it('should replaceIndex correctly', () => {
    const name = 'Kusamagen #{i}'
    const correctName = replaceIndex(name, 1)
    expect(correctName).toBe('Kusamagen #1')
  })

  it('massMintParser should work', () => {
    const commands = `...
Kusamagen #{i}
0.125
Good kusama {i} of 5`
    const parsed = massMintParser(commands)

    expect(Object.keys(parsed).length).toBe(1)
    expect(parsed['...']).toBeDefined()
    const applyForAll = parsed['...']
    expect(applyForAll.name).toBe('Kusamagen #{i}')
    expect(applyForAll.meta).toBe(0.125)
    expect(applyForAll.description).toBe('Good kusama {i} of 5')
  })

  it('should process files', () => {
    const files = [...Array(5).keys()].map((e) => new File([], `${e + 1}.jpg`))
    const parsed = processFiles(files)
    expect(parsed.length).toBe(5)
    expect(parsed[0].name).toBe('1.jpg')
    expect(parsed[0].meta).toBe(0)
  })

  it('should process range syntax correctly', () => {
    const files = [...Array(5).keys()].map((e) => new File([], `${e + 1}.jpg`))
    const ready = processFiles(files)
    const commands = `1-3
Kusamagen #{i}
0.5
{i}{i} with love

4-5
Kusamagen #{i}
1
Good generative art`
    const parsed = massMintParser(commands)

    const massMints = processRangeSyntax(ready, parsed)
    expect(massMints.length).toBe(5)
    expect(massMints[0].name).toBe('Kusamagen #1')
    expect(massMints[0].meta).toBe(0.5)
    expect(massMints[0].description).toBe('11 with love')
    expect(massMints[4].name).toBe('Kusamagen #5')
    expect(massMints[4].meta).toBe(1)
    expect(massMints[4].description).toBe('Good generative art')
  })

  it('should process match all syntax correctly', () => {
    const files = [...Array(5).keys()].map((e) => new File([], `${e + 1}.jpg`))
    const ready = processFiles(files)
    const commands = `...
Kusamagen #{i}
0.125
Good kusama {i} of 5`
    const parsed = massMintParser(commands)

    const massMints = processMatchAllSyntax(ready, parsed)
    expect(massMints.length).toBe(5)
    expect(massMints[0].name).toBe('Kusamagen #1')
    expect(massMints[0].meta).toBe(0.125)
    expect(massMints[0].description).toBe('Good kusama 1 of 5')
  })

  it('should skip name processing', () => {
    const files = [...Array(5).keys()].map((e) => new File([], `${e + 1}.jpg`))
    const ready = processFiles(files)
    const commands = `...
-
0.125
-`
    const parsed = massMintParser(commands)

    const massMints = processMatchAllSyntax(ready, parsed)
    expect(massMints.length).toBe(5)
    expect(massMints[0].name).toBe('1.jpg')
    expect(massMints[0].meta).toBe(0.125)
    expect(massMints[0].description).toBe('')
  })
})
