import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'

import { KeyringPair } from '@polkadot/keyring/types'

const WS_URL = 'ws://127.0.0.1:9944'

describe.skip('API TEST', (): void => {
  let api: ApiPromise
  const keyring = new Keyring({ type: 'sr25519' })
  let alice: KeyringPair

  beforeAll(async () => {
    const provider = new WsProvider(WS_URL)
    api = await ApiPromise.create({ provider })
    alice = keyring.createFromUri('//Alice')
  })

  afterAll(async () => {
    await api.disconnect()
  })

  it('can connect', async () => {
    const { chainSS58, chainDecimals, chainTokens } = api.registry
    expect(chainSS58).toBe(42)
    expect(chainDecimals[0]).toBe(12)
    expect(chainTokens[0]).toBe('Unit')
  })

  it('Alice can have a balance', async () => {
    const cb = api.query.system.account
    const arg = alice.address
    const result = await cb(arg)
    expect(result.data.free.toString()).not.toBe('0')
  })

  it.skip('Can remark', async () => {
    // expect(api.tx).exist();
    const cb = api.tx.system.remark
    // expect(cb).toBeDefined();
    const tx = await cb('RMRK::1.0.0::TEST').signAndSend(alice)
    expect(tx.hash.toHex()).toMatch(/^0x/)
  })
})
