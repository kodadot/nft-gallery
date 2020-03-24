import BN from 'bn.js';
import Connector from '@vue-polkadot/vue-api';

import { DerivedReferendumVote, DerivedReferendum } from '@polkadot/api-derive/types';
import { ReferendumInfoTo239, ReferendumStatus, Tally } from '@polkadot/types/interfaces';

interface State {
  allAye: DerivedReferendumVote[];
  allNay: DerivedReferendumVote[];
  voteCount: number;
  voteCountAye: number;
  voteCountNay: number;
  votedAye: BN;
  votedNay: BN;
  votedTotal: BN;
}

const defaultState: State = {
  allAye: [],
  allNay: [],
  voteCount: 0,
  voteCountAye: 0,
  voteCountNay: 0,
  votedAye: new BN(0),
  votedNay: new BN(0),
  votedTotal: new BN(0)
};

function isCurrentStatus (status: ReferendumStatus | ReferendumInfoTo239): status is ReferendumStatus {
  return !!(status as ReferendumStatus).tally;
}

function calcStateOld (votesFor: DerivedReferendumVote[]): State {
  return votesFor.reduce((state: State, derived): State => {
    const { balance, vote } = derived;
    const isDefault = vote.conviction.index === 0;
    const counted = balance
      .muln(isDefault ? 1 : vote.conviction.index)
      .divn(isDefault ? 10 : 1);

    if (vote.isAye) {
      state.allAye.push(derived);
      state.voteCountAye++;
      state.votedAye = state.votedAye.add(counted);
    } else {
      state.allNay.push(derived);
      state.voteCountNay++;
      state.votedNay = state.votedNay.add(counted);
    }

    state.voteCount++;
    state.votedTotal = state.votedTotal.add(counted);

    return state;
  }, {
    allAye: [],
    allNay: [],
    voteCount: 0,
    voteCountAye: 0,
    voteCountNay: 0,
    votedAye: new BN(0),
    votedNay: new BN(0),
    votedTotal: new BN(0)
  });
}

function calcState (tally: Tally, votes: DerivedReferendumVote[] = []): State {
  const allAye: DerivedReferendumVote[] = [];
  const allNay: DerivedReferendumVote[] = [];

  votes.forEach((derived): void => {
    if (derived.vote.isAye) {
      allAye.push(derived);
    } else {
      allNay.push(derived);
    }
  });

  return {
    allAye,
    allNay,
    voteCount: allAye.length + allNay.length,
    voteCountAye: allAye.length,
    voteCountNay: allNay.length,
    votedAye: tally.ayes,
    votedNay: tally.nays,
    votedTotal: tally.turnout
  };
}


const referendumState = async (referendum: any): Promise<State> => {
	if (Connector.getInstance()) {
		const votes = await Connector.getInstance().api.derive.democracy.referendumVotes(referendum.index);
		if (isCurrentStatus(referendum.status)) {
      return calcState(referendum.status.tally, votes);
    } else if (votes) {
      return calcStateOld(votes);
    }
  } 
  
  return defaultState;
};

export default referendumState;
