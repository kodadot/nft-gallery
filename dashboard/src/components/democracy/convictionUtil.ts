import Connector from '@vue-polkadot/vue-api';

export interface ConvictionOption {
	text: string;
	value: number;
}

const messageTransfer = (value: any, lock: any, period: any) =>
	`${value}x voting balance, locked for ${lock}x enactment (${period} days)`;

const CONVICTIONS: [number, number][] = [
	1,
	2,
	4,
	8,
	16,
	32,
].map((lock, index) => [index + 1, lock]);

const convictionMapper = (
	[value, lock]: [number, number],
	enact: number,
): ConvictionOption => ({
	text: messageTransfer(value, lock, (enact * lock).toFixed(2)),
	value,
});

export default (): ConvictionOption[] => {
	const { api } = Connector.getInstance();
	
	if (!api) {
		return [];
	}

	const enact =
		(((api.consts.democracy.enactmentPeriod.toNumber() *
			api.consts.timestamp.minimumPeriod.toNumber()) /
			1000) *
			2) /
		60 /
		60 /
		24;

	return [
		{ text: '0.1x voting balance, no lockup period', value: 0 },
		...CONVICTIONS.map((pair) => convictionMapper(pair, enact)),
	];
};
