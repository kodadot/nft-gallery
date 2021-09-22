import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { expect } from 'chai';

import { KeyringPair } from '@polkadot/keyring/types';

const WS_URL = 'ws://127.0.0.1:9944';

describe('API TEST', (): void => {
  let api: ApiPromise;
  const keyring = new Keyring({ type: 'sr25519' });
  let alice: KeyringPair;

  before(async () => {
    const provider = new WsProvider(WS_URL);
    api = await ApiPromise.create({ provider });
    alice = keyring.createFromUri('//Alice');
  });

  after(async () => {
    await api.disconnect();
  });

  it('can connect', async () => {
    const { chainSS58, chainDecimals, chainTokens } = api.registry;
    expect(chainSS58).to.be.equal(42);
    expect(chainDecimals[0]).to.be.equal(12);
    expect(chainTokens[0]).to.be.equal('Unit');
  });

  it('Alice can have a balance', async () => {
    const cb = api.query.system.account;
    const arg = alice.address;
    const result = await cb(arg);
    expect(result.data.free.toString()).not.to.be.equal('0');
  });

  it.skip('Can remark', async () => {
    // expect(api.tx).exist();
    const cb = api.tx.system.remark;
    // expect(cb).toBeDefined();
    const tx = await cb('RMRK::1.0.0::TEST').signAndSend(alice);
    expect(tx.hash.toHex()).to.match(/^0x/);
  });
});
