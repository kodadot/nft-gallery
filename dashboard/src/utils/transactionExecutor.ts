import keyring from '@polkadot/ui-keyring';
import { KeyringAccount } from '@/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { getAddress } from '@/extension';

const exec = async (account: KeyringAccount | string, password: string | null, callback: (...params: any) => SubmittableExtrinsic<'promise'>, params: any[]) => {
	try {
    const transfer = await callback(...params);
    const address = typeof account === 'string' ? account : account.address;
    const injector = await getAddress(address);
    if (injector) {
      const h = await transfer.signAndSend(address, { signer: injector.signer });
      return h.toHex();
    }

    const alicePair = keyring.getPair(address);
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
