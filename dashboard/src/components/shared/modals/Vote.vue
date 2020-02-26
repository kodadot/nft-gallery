<template>
	<ModalWrapper :label="'Vote'">
		<Dropdown mode="accounts" @selected="handleAccountSelection" />
		<b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <div class="transaction buttons">
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
export default class Vote extends Vue {
	private account: any = {};
	private password: string = '';
	

  public handleAccountSelection(account: KeyringPair) {
		this.account = account;
	}

	public shipIt() {
		return;
	}
  
}
</script>
