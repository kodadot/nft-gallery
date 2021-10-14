import { expect } from 'chai'
import { massMintParser, replaceIndex } from '@/components/rmrk/Create/mintUtils'

// const commands = `...
// Kusamagen #{i}
// 0.125
// Good kusama {i} of 5
// `

const files = [...Array(5).keys()].map(e => new File([], `${e+1}.jpg`))

describe('MASS MINT TEST', () => {
  // let wrapper: Wrapper<MassMint>


  beforeEach(() => {
    // wrapper = mount(MassMint)
  })

  it('should replaceIndex correctly', () => {
    const name = 'Kusamagen #{i}'
    const correctName = replaceIndex(name, 1)
    expect(correctName).to.equal('Kusamagen #1')
  })



  it('massMintParser should work', () => {
    const commands = `...
Kusamagen #{i}
0.125
Good kusama {i} of 5
`
    const parsed = massMintParser(commands)

    expect(Object.keys(parsed).length).to.equal(1)
    expect(parsed['...']).to.exist
    const applyForAll = parsed['...']
    expect(applyForAll.name).to.equal('Kusamagen #{i}')
    expect(applyForAll.price).to.equal(0.125)
    expect(applyForAll.description).to.equal('Good kusama {i} of 5')
  })
})
