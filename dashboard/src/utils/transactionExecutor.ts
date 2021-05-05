import keyring from '@polkadot/ui-keyring';
import { KeyringAccount } from '@/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Callback, ISubmittableResult } from '@polkadot/types/types';
import { getAddress } from '@/extension';
import { toDefaultAddress } from '@/utils/account'
import { DispatchError, Hash } from '@polkadot/types/interfaces';

export type ExecResult = (() => void) | string
export type Extrinsic = SubmittableExtrinsic<'promise'>

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
    const injector = await getAddress(toDefaultAddress(address));
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


export const txCb = (onSuccess: (blockHash: Hash) => void, onError: (err: DispatchError) => void) =>
  (result: ISubmittableResult) => {
    console.log(`[EXEC] current`, result);
    if (result.dispatchError) {
      console.warn(`[EXEC] dispatchError`, result);
      onError(result.dispatchError)
    }

    if (result.status.isFinalized) {
      console.log(`[EXEC] Finalized`, result);
      console.log(`[EXEC] blockHash ${result.status.asFinalized}`);
      onSuccess(result.status.asFinalized)
    }
  }

export const estimate = async (account: KeyringAccount | string, callback: (...params: any) => SubmittableExtrinsic<'promise'>, params: any[]): Promise<string> => {
  const transfer = await callback(...params);
  const address = typeof account === 'string' ? account : account.address;
  const injector = await getAddress(toDefaultAddress(address));

  const info = await transfer.paymentInfo(address, injector ?  { signer: injector.signer } : {})
  return info.partialFee.toString()
}



export default exec;
