import keyring from '@polkadot/ui-keyring';
import { KeyringAccount } from '@/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Callback } from '@polkadot/types/types';
import { getAddress } from '@/extension';

export type ExecResult = (() => void) | string

export const execResultValue = (execResult: ExecResult): string => {
  if (typeof execResult === 'function') {
    execResult()
    return ''
  }

  return execResult
}

const exec = async (account: KeyringAccount | string, password: string | null, callback: (...params: any) => SubmittableExtrinsic<'promise'>, params: any[], statusCb?: Callback<any>): Promise<ExecResult> => {
	try {
    const transfer = await callback(...params);
    const address = typeof account === 'string' ? account : account.address;
    const injector = await getAddress(address);
    if (injector) {
      const h = await transfer.signAndSend(address, { signer: injector.signer }, statusCb);
      return h
    }

    const alicePair = keyring.getPair(address);
    if (password) {
      alicePair.decodePkcs8(password);
    }
		const hash = statusCb ? await transfer.signAndSend(alicePair, statusCb) : await transfer.signAndSend(alicePair);
		return typeof hash === 'function' ? hash : hash.toHex();

	} catch (err) {
		throw err;
	}

};


export default exec;
