import correctFormat from '@/utils/ss58Format'
import { encodeAddress, isAddress } from '@polkadot/util-crypto'
import { expect } from 'chai'

describe('EXPERTMINT TEST', (): void => {
  it('can process only valid addresses', async () => {
    const addresses: string[] = [
      'DfJKo4NyfXJjsuYt7bePxcJPxYMPDDjrs1sNdAoKQg9TxgU',
      'F2z5UsiFscpMn7vUwMSERWSGJtVi6WBp7s3YPzvBc44UAZo',
      'D6HSL6nGXHLYWSN8jiL9MSNixH2F2o382KkHsZAtfZvBnxM',
      'Dr4q66uWymzjvLTcrkKUbSLLnMZpy71zGsc3Y7dZSFtQxeY',
      'D5QSdd589pFWeJm9bz1j3RTyy14ejKpnUKyEa4GBW9kYkVC',
      'H4YEv9v4DzU6WJsF2pxSHGcVxZEZDS761XWYsnRKX7P3aMQ',
      'HFTEBQuR4xFvbf9TLBvvdyGHMHvungxSLVFKTLrt7GxVKDV',
    ]
    const onlyValid = addresses
      .filter((a) => isAddress(a))
      .map((a) => encodeAddress(a, correctFormat(2)))
    expect(onlyValid).to.deep.equal(addresses)
    expect(onlyValid.length).to.equal(addresses.length)
  })

  it('can process only valid addresses', async () => {
    const addresses: string[] = [
      'CoTPEspRmWrs2oHcydjZyUamSYTfEUVzpL6zHADQsribHJa',
      '5CQGbctDsuH1a8XxSEJRqns7gaRJygEnvsiYok3QqgbawqFo',
      'HHFPubeACQ7758rhQADniUzcNEAywn3q4CaRqGPFmbNTdxt',
      '16WydiWhahkhmfFRhDJMhkiHUrwSzt9hSuQVbhwSwQg2G4Um',
      'GxnJ6B6dQTmcmcQJbZUiT39wvpT1gwK5a8Zs24nFjuDh88u',

    ]
    const onlyValid = addresses
      .filter((a) => isAddress(a))
      .map((a) => encodeAddress(a, correctFormat(2)))
    expect(onlyValid[1]).to.equal('CutFwE6WGHwKnMQCw7UjkE7qAhYnM3yPFZJCQKNKUp5h8Y6')
    expect(onlyValid[3]).to.equal('J6J9hbWMHWA5n4MWH4QTZF8mqE37FQjpnWkq5E3s7rzpz9h')
    expect(onlyValid.length).to.equal(addresses.length)
  })
})
