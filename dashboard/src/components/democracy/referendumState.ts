import BN from 'bn.js';
import Connector from '@vue-polkadot/vue-api';


const defaultState = {
	voteCount: 0,
	voteCountAye: 0,
	voteCountNay: 0,
	votedAye: new BN(0),
	votedNay: new BN(0),
	votedTotal: new BN(0),
};

const referendumState = async (index: number) => {
	if (Connector.getInstance()) {
		const votesFor = await Connector.getInstance().api.derive.democracy.referendumVotesFor(index);
		// console.log('referendumState: votesFor', votesFor.length);
		const newState = votesFor.reduce((state: any, { balance, vote }: { balance: any, vote: any }) => {
			const isDefault = vote.conviction.index === 0;
			const counted = balance
				.muln(isDefault ? 1 : vote.conviction.index)
				.divn(isDefault ? 10 : 1);

			if (vote.isAye) {
				state.voteCountAye++;
				state.votedAye = state.votedAye.add(counted);
			} else {
				state.voteCountNay++;
				state.votedNay = state.votedNay.add(counted);
			}

			state.voteCount++;
			state.votedTotal = state.votedTotal.add(counted);

			return state;
		}, defaultState);

	 return newState;
	} else {
		return defaultState;
	}
};

export default referendumState;
