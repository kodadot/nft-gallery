<template>
  <div class="card proposal-card">
    <div class="card-content proposal-content">
      <div class="proposal-index" @click="toggleArgsVisible">{{ proposal.index.toString() }}</div>
      <div class="proposal-proposer">
				<Identicon :value="proposal.proposer.toString()" />
				<div>
				<div><b>Address: </b></div>
        <div>{{ address }}</div>
				</div>
      </div>
      <div class="proposal-balance">
        <div><b>Locked: </b></div>
        <div>{{ proposal.balance }}</div>
      </div>
      <div
        class="proposal-proposal proposal-magic"
        v-if="proposal.proposal"
      >
        <div>
          <b>
            {{ proposal.proposal.sectionName }}.{{
              proposal.proposal.methodName
            }}
          </b>
        </div>
        <div
          v-for="(doc, index) in proposal.proposal.meta['documentation']"
          :key="index"
        >
          {{ doc }}
        </div>
      </div>
      <div v-else class="proposal-magic">
        <b-button type="is-dark" icon-left="plus" disabled>
          Preimage
        </b-button>
      </div>
			<div class="proposal-buttons">
			<SecondModal :referendumId="proposal.index" />
      <Seconds :accounts="proposal.seconds" />
			</div>
    </div>
    <div v-if="isArgsVisible">
      <Argurments
        v-if="proposal.proposal"
        :args="enhanceArgs()"
        @selected="handleSelectedArguments"
        :defaultValues="proposal.proposal.args"
        disabled
      />

      <b-message class="proposal-hash" type="is-info">
        <label><b>Proposal Hash: </b></label><span>{{ proposal.hash }}</span>
      </b-message>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Argurments from '@/components/extrinsics/Arguments.vue';
import Seconds from './Seconds.vue';
import SecondModal from '@/components/shared/modals/Second.vue';
import Identicon from '@polkadot/vue-identicon';
import shortAddress from '@/utils/shortAddress';

@Component({
  components: {
    Argurments,
		Seconds,
		SecondModal,
		Identicon,
  },
})
export default class Proposal extends Vue {
  @Prop() public proposal: any;

  private isArgsVisible: boolean = false;

	get address() {
		return shortAddress(this.proposal.proposer.toString());
	}

  public toggleArgsVisible() {
    this.isArgsVisible = !this.isArgsVisible;
  }

  public handleSelectedArguments() {
    return;
  }

  public enhanceArgs() {
    return this.proposal.proposal.meta.args;
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

.proposal-proposer {
  overflow: hidden;
  text-overflow: ellipsis;
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;
}

.proposal-proposal {
	cursor: pointer;
}

.proposal-index {
  font-size: 2em;
}

.proposal-hash {
  margin-top: 1em;
}

.proposal-buttons {
	display: flex;
}

.proposal-magic {
	flex-basis: 32em;
}
</style>
