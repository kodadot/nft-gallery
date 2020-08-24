import keyring from '@polkadot/ui-keyring';
import { KeyringAccount } from '@/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';

const exec = async (account: KeyringAccount | string, password: string | null, callback: (...params: any) => SubmittableExtrinsic<'promise'>, params: any[]) => {
	try {
		const transfer = await callback(...params);
    const alicePair = keyring.getPair(typeof account === 'string' ? account : account.address);
    if (password) {
      alicePair.decodePkcs8(password);
    }
		const hash = await transfer.signAndSend(alicePair);
		return hash.toHex();

	} catch (err) {
		throw err;
	}

};

export default exec;
