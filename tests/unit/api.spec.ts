import { ApiPromise, WsProvider } from '@polkadot/api';
import { expect } from 'chai';

const WS_URL = 'ws://127.0.0.1:9944';

describe('API TEST', (): void => {
  let api: ApiPromise;

  before(async () => {
    const provider = new WsProvider(WS_URL);
    api = await ApiPromise.create({ provider });
  });

  after(async () => {
    await api.disconnect();
  });

  it('can connect', async () => {
    const { chainSS58, chainDecimals, chainTokens  } = api.registry
    expect(chainSS58).to.be.equal(42);
    expect(chainDecimals[0]).to.be.equal(12);
    expect(chainTokens[0]).to.be.equal('Unit');
  });
});
