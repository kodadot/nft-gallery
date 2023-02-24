import { buyActions, getActions, ownerActions } from '@/utils/shoppingActions'

describe('GET ACTIONS TEST', (): void => {
  it('owner actions', () => {
    const actions = getActions(true, false)
    expect(actions).to.eql(ownerActions)
  })
  it('can buy', () => {
    const actions = getActions(false, true)
    expect(actions).to.eql(buyActions)
  })
  it('has no action', () => {
    const actions = getActions(false, false)
    expect(actions.length).toBe(0)
  })
})
