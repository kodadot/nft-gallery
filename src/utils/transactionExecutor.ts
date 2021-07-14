import keyring from '@polkadot/ui-keyring';
import { KeyringAccount } from '@/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { Callback, ISubmittableResult } from '@polkadot/types/types';
import { getAddress } from '@/extension';
import { toDefaultAddress } from '@/utils/account'
import { DispatchError, Hash } from '@polkadot/types/interfaces';
import { ContractTx } from '@polkadot/api-contract/base/types';
import { ContractOptions } from '@polkadot/api-contract/types';

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


export const txCb = (onSuccess: (blockHash: Hash) => void, onError: (err: DispatchError) => void, onResult: (result: ISubmittableResult) => void = console.log, successOnBlock?: boolean) =>
  (result: ISubmittableResult) => {
    onResult(result);
    if (result.dispatchError) {
      console.warn(`[EXEC] dispatchError`, result);
      onError(result.dispatchError)
    }

    if (successOnBlock ? result.status.isInBlock : result.status.isFinalized) {
      console.log(`[EXEC] Finalized`, result);
      // console.log(`[EXEC] blockHash ${result.status.asFinalized}`);
      onSuccess(successOnBlock ? result.status.asInBlock : result.status.asFinalized)
    }
  }

export const estimate = async (account: KeyringAccount | string, callback: (...params: any) => SubmittableExtrinsic<'promise'>, params: any[]): Promise<string> => {
  const transfer = await callback(...params);
  const address = typeof account === 'string' ? account : account.address;
  const injector = await getAddress(toDefaultAddress(address));

  const info = await transfer.paymentInfo(address, injector ?  { signer: injector.signer } : {})
  return info.partialFee.toString()
}


export type ContractParams = {
  options: ContractOptions
  params: any[];
}


export const contractExec = async (account: KeyringAccount | string, password: string | null, callback: ContractTx<'promise'>, params: ContractParams, statusCb?: Callback<any>): Promise<ExecResult> => {
	try {
    const transfer = await callback({ ...params.options }, ...params.params);
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

export const defaultContractOptions: ContractOptions = {
  value: 0,
  gasLimit: -1
}


export default exec;
