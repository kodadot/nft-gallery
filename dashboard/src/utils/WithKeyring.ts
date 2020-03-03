import Vue from 'vue';
import Component from 'vue-class-component';
import keyring from '@vue-polkadot/vue-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';

@Component
export default class WithKeyring extends Vue {
  protected keyringLoaded: boolean = false;
  protected keyringAccounts: KeyringPair[] = [];
  protected keys: any = '';

  public async mountWasmCrypto(): Promise<void> {
    await cryptoWaitReady();
    // console.log('wasmCrypto loadedX');
    this.loadKeyring();
    // console.log('keyring initX');
  }

  public loadKeyring(): void {
    this.keyringLoaded = true;
    this.keys = keyring;
    this.mapAccounts();
  }

  public mapAccounts(): void {
    this.keyringAccounts = keyring.getPairs();
  }

  public mounted(): void {
    this.mountWasmCrypto();

  }

  public getPair(address: string): KeyringPair {
    return keyring.getPair(address);
  }

  public vueU8aToHex(publicKey: Uint8Array): string {
    return u8aToHex(publicKey);
  }


}
