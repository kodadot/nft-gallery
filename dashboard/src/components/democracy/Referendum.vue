<template>
  <div class="card proposal-card" v-if="shouldRender">
    <div class="card-content proposal-content">
      <div class="proposal-index" @click="toggleArgsVisible">{{ referendum.index.toString() }}</div>
      <div class="proposal-proposal"  v-if="referendum.proposal">
        <div><b>
          {{ referendum.proposal.sectionName }}.{{
            referendum.proposal.methodName
          }}
        </b></div>
        <div>{{ referendum.proposal.meta["documentation"].join('') }}</div>
      </div>
           <div v-else class="proposal-magic">
        <b-button type="is-dark" icon-left="plus" disabled>
          Preimage
        </b-button>
      </div>
      <div class="proposal-meta">
        <div><b>Remaining: </b><div>{{remaining}} </div></div>
        <div><b>Activate at: </b><div>{{enactBlock}} </div></div>
        <div><b>Aye ({{state.voteCountAye}}): </b><div>{{state.votedAye}} KSM</div></div>
        <div><b>Nay ({{state.voteCountNay}}): </b><div>{{state.votedNay}} KSM</div></div>
      </div>
			<Vote :referendumId="referendum.index" />
    </div>
    <div v-if="isArgsVisible">
      <Argurments
        :args="enhanceArgs()"
        @selected="handleSelectedArguments"
        :defaultValues="referendum.proposal.args"
        :disabled="true"
      />
      <b-message class="proposal-hash" type="is-info">
        <label><b>Proposal Hash: </b></label><span>{{ referendum.hash }}</span>
      </b-message>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Argurments from '@/components/extrinsics/Arguments.vue';
import referendumState from './referendumState';
import Connector from '@vue-polkadot/vue-api';
import Vote from '@/components/shared/modals/Vote.vue';

@Component({
  components: {
    Argurments,
		Vote,
  },
})
export default class Referendum extends Vue {
  @Prop() public referendum: any;

	private shouldRender: boolean = true;
  private isArgsVisible: boolean = true;
	private state: any = {};
	private bestNumber: any = {};
	private enactBlock: any = {};
	private remaining: any = {};

	public async mounted() {
		this.state = await referendumState(this.referendum);
		this.bestNumber = await Connector.getInstance().api.derive.chain.bestNumber();
		this.enactBlock = this.referendum.info.end.add(this.referendum.info.delay);
		this.remaining = this.referendum.info.end.sub(this.bestNumber).subn(1);

		if (!this.bestNumber || this.referendum.info.end.sub(this.bestNumber).lten(0)) {
    	this.shouldRender = false;
  	}
	}

  public toggleArgsVisible() {
    this.isArgsVisible = !this.isArgsVisible;
  }

  public handleSelectedArguments() {
    return;
  }

  public enhanceArgs() {
    return this.referendum.proposal.meta.args;
  }

}
</script>


<style scoped>
.card.proposal-card {
  margin-bottom: 1em;
}

.card-content.proposal-content {
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
  flex-flow: row wrap;
}

.proposal-index {
  font-size: 2em;
  flex-grow: 1;
}

.proposal-proposal {
  cursor: pointer;
  flex-grow: 1;
	padding: 0 0.5em;
	max-width: 50em;
}

.proposal-meta {
    display: flex;
    flex-grow: 1;
		flex-flow: row wrap;
		justify-content: space-evenly;
}

.proposal-meta div {
	padding: 0 0.3em;
}

.proposal-hash {
  margin-top: 1em;
}
</style>
