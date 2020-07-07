import keyring from '@polkadot/ui-keyring';

const exec = async (account: any, password: any, callback: any, params: any) => {
	try {
		const transfer = await callback(...params);
		const alicePair = keyring.getPair(account.address);
		alicePair.decodePkcs8(password);
		const hash = await transfer.signAndSend(alicePair);
		return hash.toHex();

	} catch (err) {
		throw err;
	}

};

export default exec;
