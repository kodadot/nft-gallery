<template>
	<div id="Dropdown">
		<section>
		<b-field>
			<p>{{label}}
				<b-tooltip type="is-dark" :label="tooltip">
					<b-icon size="is-small" icon="question-circle">
					</b-icon>
				</b-tooltip>
			</p>
		</b-field>
		<b-field>
			<b-dropdown v-model="selected" 
				:mobile-modal="false" aria-role="list">
				<button class="button is-primary" type="button" slot="trigger">
					<template v-if="selected">
						<b-icon icon="users"></b-icon>
						<span>{{selected}}</span>
					</template>
					<template v-else>
						<b-icon icon="users"></b-icon>
						<span>Select Account</span>
					</template>
					<b-icon icon="caret-down"></b-icon>
				</button>
				<b-dropdown-item aria-role="listitem"
					v-if="accounts"
					v-for="acc in accounts"
					v-bind:key="acc.address"
					v-bind:value="acc.address">
					<div class="media">
						<b-icon class="media-left" icon="users">
						</b-icon>
						<div class="media-content">
							<h3>{{ acc.meta.name }}</h3>
							<small>{{ acc.address }}</small>
						</div>
					</div>
				</b-dropdown-item>
			</b-dropdown>
		</b-field>
		<Balance :account="selectedAccount"/>
		</section>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import WithKeyring from '@/utils/WithKeyring';
import Balance from './Balance.vue';

@Component({
	components: {
		Balance,
	},
})
export default class Dropdown extends WithKeyring {
	// @Prop(Array) public accounts!: object;
	@Prop({ default: 'all' }) public mode!: string;

	private position: string = 'is-left';
  private selectedAccount: string = '';
	private label: string = 'To Contacts';
	private tooltip: string = 'Select a contact you want to send funds to.';

	get accounts() {
		return this.keyringAccounts.filter((acc) => !acc.meta.isTesting);
	}
	
  get selected() {
		return this.selectedAccount;
	}

	set selected(address: string) {
		this.selectedAccount = address;
		this.onSelectedAccount(address);
	}

	@Emit('selected')
	public onSelectedAccount(address: string) {
		return this.getPair(address);
	}

	public mounted(): void {
  	this.gotKeys(this.mode);
  }

  private gotKeys(mode: string): void {
		if (mode === 'accounts') {
			this.label = 'From Accounts';
			this.tooltip = 'The account you will send funds from.';
		}
  } 
}

</script>
