import Connector from '@vue-polkadot/vue-api';
import keyring from '@vue-polkadot/vue-keyring';

const { api } = Connector.getInstance();

const exec = async (account: any, password: any, callback: any, params: any) => {
	try {
		const transfer = await callback(...params);
		const nonce = await api.query.system.accountNonce(account.address);
		const alicePair = keyring.getPair(account.address);
		alicePair.decodePkcs8(password);
		console.info('exec', await nonce.toString());
		const hash = await transfer.signAndSend(alicePair);
		return hash.toHex();

	} catch (err) {
		throw err;
	}

};

export default exec;
