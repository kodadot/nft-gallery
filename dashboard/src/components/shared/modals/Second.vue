<template>
	<ModalWrapper label="Second" icon="users">
		<div>
		<Dropdown mode="accounts" @selected="handleAccountSelection" />
		<b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!account || !password"
        @click="shipIt"
      >
        Submit
      </b-button>
    </div>
		
	</ModalWrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ModalWrapper from './ModalWrapper.vue';
import Dropdown from '@/components/shared/Dropdown.vue';
import { KeyringPair } from '@polkadot/keyring/types';

@Component({
	components: {
		ModalWrapper,
		Dropdown,
	},
})
export default class Second extends Vue {
	private account: any = {};
	private password: string = '';
	private vote: any = null;
	

  public handleAccountSelection(account: KeyringPair) {
		this.account = account;
	}

	public handleVote(vote: boolean) {
		this.vote = vote;
	}

	public shipIt() {
		return;
	}
  
}
</script>
