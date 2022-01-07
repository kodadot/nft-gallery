import { sendFunction, shuffle } from '@/components/accounts/utils'
import NFTUtils from '@/components/rmrk/service/NftUtils'
import correctFormat from '@/utils/ss58Format'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import { seed } from './sample3'

describe('EXPERTMINT TEST', (): void => {
  let addresses: string[]

  beforeAll(() => {
    addresses = [
      'DfJKo4NyfXJjsuYt7bePxcJPxYMPDDjrs1sNdAoKQg9TxgU',
      'F2z5UsiFscpMn7vUwMSERWSGJtVi6WBp7s3YPzvBc44UAZo',
      'D6HSL6nGXHLYWSN8jiL9MSNixH2F2o382KkHsZAtfZvBnxM',
      'Dr4q66uWymzjvLTcrkKUbSLLnMZpy71zGsc3Y7dZSFtQxeY',
      'D5QSdd589pFWeJm9bz1j3RTyy14ejKpnUKyEa4GBW9kYkVC',
      'H4YEv9v4DzU6WJsF2pxSHGcVxZEZDS761XWYsnRKX7P3aMQ',
      'HFTEBQuR4xFvbf9TLBvvdyGHMHvungxSLVFKTLrt7GxVKDV',
    ]
  })


  it.skip('can process only valid addresses', async () => {
    const onlyValid = addresses
      .filter((a) => isAddress(a))
      .map((a) => encodeAddress(a, correctFormat(2)))
    expect(onlyValid).toEqual(addresses)
    expect(onlyValid.length).toBe(addresses.length)
  })

  it.skip('can process only valid addresses', async () => {
    const test = [ ...addresses ]
    test[1] = '5CQGbctDsuH1a8XxSEJRqns7gaRJygEnvsiYok3QqgbawqFo'
    test[3] = '16WydiWhahkhmfFRhDJMhkiHUrwSzt9hSuQVbhwSwQg2G4Um'

    const onlyValid = addresses
      .filter((a) => isAddress(a))
      .map((a) => encodeAddress(a, correctFormat(2)))
    expect(onlyValid[1]).toBe('CutFwE6WGHwKnMQCw7UjkE7qAhYnM3yPFZJCQKNKUp5h8Y6')
    expect(onlyValid[3]).toBe('J6J9hbWMHWA5n4MWH4QTZF8mqE37FQjpnWkq5E3s7rzpz9h')
    expect(onlyValid.length).toBe(addresses.length)
  })


  it('can make distribution correcly', async () => {
    const addresses: string[] = [
      'D6HSL6nGXHLYWSN8jiL9MSNixH2F2o382KkHsZAtfZvBnxM',
      'Dr4q66uWymzjvLTcrkKUbSLLnMZpy71zGsc3Y7dZSFtQxeY',
      'D5QSdd589pFWeJm9bz1j3RTyy14ejKpnUKyEa4GBW9kYkVC',
      'H4YEv9v4DzU6WJsF2pxSHGcVxZEZDS761XWYsnRKX7P3aMQ',
      'HFTEBQuR4xFvbf9TLBvvdyGHMHvungxSLVFKTLrt7GxVKDV',
    ]
    const nfts = [
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000001',
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000002',
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000003',
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000004',
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000005',
    ]
    const fn = sendFunction(addresses, 50)
    expect(typeof fn).toBe('function')
    const res = fn(nfts, '1.0.0')
    expect(res.length).toBe(2)
    expect(res[0]).toBe('RMRK::SEND::1.0.0::9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000001::D5QSdd589pFWeJm9bz1j3RTyy14ejKpnUKyEa4GBW9kYkVC')
    expect(res[1]).toBe('RMRK::SEND::1.0.0::9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000002::D6HSL6nGXHLYWSN8jiL9MSNixH2F2o382KkHsZAtfZvBnxM')
  })

  it('can send correctly even you have not enough NFTs', async () => {
    const addresses: string[] = [
      'D6HSL6nGXHLYWSN8jiL9MSNixH2F2o382KkHsZAtfZvBnxM',
      'Dr4q66uWymzjvLTcrkKUbSLLnMZpy71zGsc3Y7dZSFtQxeY',
      'D5QSdd589pFWeJm9bz1j3RTyy14ejKpnUKyEa4GBW9kYkVC',
      'H4YEv9v4DzU6WJsF2pxSHGcVxZEZDS761XWYsnRKX7P3aMQ',
      'HFTEBQuR4xFvbf9TLBvvdyGHMHvungxSLVFKTLrt7GxVKDV',
    ]
    const nfts = [
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000001',
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000002',
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000003',
    ]
    const fn = sendFunction(addresses, 100)
    expect(typeof fn).toBe('function')
    const res = fn(nfts, '1.0.0')
    expect(res.length).toBe(3)
    expect(res[0]).toBe('RMRK::SEND::1.0.0::9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000001::D5QSdd589pFWeJm9bz1j3RTyy14ejKpnUKyEa4GBW9kYkVC')
    expect(res[1]).toBe('RMRK::SEND::1.0.0::9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000002::D6HSL6nGXHLYWSN8jiL9MSNixH2F2o382KkHsZAtfZvBnxM')
    expect(res[2]).toBe('RMRK::SEND::1.0.0::9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000003::Dr4q66uWymzjvLTcrkKUbSLLnMZpy71zGsc3Y7dZSFtQxeY')
  })

  it('cam simple mint mimmics sendFN', () => {
    const addresses: string[] = [
      'D6HSL6nGXHLYWSN8jiL9MSNixH2F2o382KkHsZAtfZvBnxM',
      'Dr4q66uWymzjvLTcrkKUbSLLnMZpy71zGsc3Y7dZSFtQxeY',
    ]
    const nfts = [
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000001',
      '9638200-8CC1B91E899D9BE40E-KODA-KODA-0000000000000002',
    ]

    const fn = sendFunction(addresses, 100)
    const res = fn(nfts, '1.0.0')
    const mint = addresses.map((addr, index) => NFTUtils.createInteraction('SEND', '1.0.0', nfts[index], String(addr)))
    expect(res.length).toBe(2)
    expect(res[0]).toBe(mint[0])
    expect(res[1]).toBe(mint[1])
  })

  it('can send correctly shuffle', () => {
    const res = shuffle(addresses, seed)
    expect(res.length).toBe(addresses.length)
    expect(res[0]).toBe('D6HSL6nGXHLYWSN8jiL9MSNixH2F2o382KkHsZAtfZvBnxM')
    expect(res[1]).toBe('H4YEv9v4DzU6WJsF2pxSHGcVxZEZDS761XWYsnRKX7P3aMQ')

  })
})
