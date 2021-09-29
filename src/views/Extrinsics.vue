<template>
	<div>
		<!-- <b-tabs>
			<b-tab-item label="Extrinsic submission"></b-tab-item>
		</b-tabs> -->
		<Dropdown mode="accounts" @selected="handleAccountSelection" />
		<div class="executor-wrapper">
			<Executor
				:methods="sections"
				@selected="handleSectionSelection"
				label="submit the following extrinsic"
			/>
			<Executor
				:methods="methods"
				@selected="handleMethodSelection"
				label="method"
			/>
			<!-- <InputFile /> -->
		</div>
		<Argurments :args="args" @selected="handleSelectedArguments" />
		<b-field
			v-if="account"
			class="password-wrapper"
			label="put magic spell here - password"
		>
			<b-input v-model="password" type="password" password-reveal></b-input>
		</b-field>
		<div class="transaction buttons">
			<!-- <b-button type="is-danger" outlined disabled>Submit unsigned</b-button> -->
			<b-button
				type="is-primary"
				icon-left="paper-plane"
				outlined
				:disabled="!account || !password"
				@click="shipIt"
			>
				Submit
			</b-button>
			<b-button
				v-if="tx"
				tag="a"
				:href="getExplorerUrl(tx)"
				icon-left="external-link-alt"
			>
				View {{ tx.slice(0, 20) }}
			</b-button>
		</div>
	</div>
</template>

<script lang="ts">
import Selection from '../components/extrinsics/Selection.vue'
import Executor from '../components/extrinsics/Executor.vue'
import Argurments from '../components/extrinsics/Arguments.vue'
import { Prop, Vue, Component } from 'vue-property-decorator'
import { KeyringPair } from '@polkadot/keyring/types'
import InputFile from '../components/extrinsics/components/InputFile.vue'
import keyring from '@polkadot/ui-keyring'
import Dropdown from '@/components/shared/Dropdown.vue'
import { urlBuilderTransaction } from '@/utils/explorerGuide'

@Component({
	components: {
		Selection,
		Executor,
		Argurments,
		InputFile,
		Dropdown,
	},
})
export default class Extrinsics extends Vue {

	get sections() {
		return Object.keys((this as any).$http.api.tx)
	}

	get methods() {
		return this.fnSection
			? Object.keys((this as any).$http.api.tx[this.fnSection])
			: []
	}
	private isValid = false;
	private isValidUnsigned = false;
	private method = null;
	// private apiDefaultTxSudo = apiDefaultTxSudo;
	// private methods =
	private fnSection = '';
	private fnMethod = '';
	private args: any[] = [];
	private selectedArguments = {};
	private account: any = null;
	private password = '';
	private tx = '';
	private conn: any = {
		blockNumber: '',
		chain: '',
		nodeName: '',
		nodeVersion: '',
		header: {},
	};
	private snackbarTypes = {
		success: {
			type: 'is-success',
			actionText: 'View',
			onAction: () => window.open(this.getExplorerUrl(this.tx), '_blank'),
		},
		info: {
			type: 'is-info',
			actionText: 'OK',
		},
		danger: {
			type: 'is-danger',
			actionText: 'Oh no!',
		},
	};

	getExplorerUrl(value: string) {
		return urlBuilderTransaction(value,
			this.$store.state.explorer.chain,
			this.$store.state.explorer.provider)
	}

	public handleSectionSelection(value: string) {
		this.fnSection = value
	}

	public handleMethodSelection(value: string) {
		this.fnMethod = value
		this.args = (this as any).$http.api.tx[this.fnSection][value].meta.args
	}

	public handleSelectedArguments(value: any) {
		this.selectedArguments = {
			...this.selectedArguments,
			...value,
		}
	}

	public handleAccountSelection(account: KeyringPair) {
		console.log('account', account)

		this.account = account
	}

	// TODO: https://polkadot.js.org/api/examples/promise/06_make_transfer/
	public async submitTx() {
		const { api } = (this as any).$http
		console.log('here', (api && this.account && this.fnMethod && this.fnSection))
		if (api && this.account && this.fnMethod && this.fnSection) {
			const args = this.args.map(this.argMapper)
			console.log(args)
			const func = api.tx[this.fnSection][this.fnMethod](...args)
			try {
				console.log('func is ', func)
				const hash = await func.signAndSend(this.account)
				console.log('Transfer sent with hash', hash.toHex())
			} catch (e) {
				console.warn('Err occ', e)

			}

		}
	}

	public async shipIt(): Promise<void> {
		if ((this as any).$http.api) {
			const apiResponse = await (this as any).$http.api.rpc.system.chain()
			this.conn.chainName = await apiResponse.toString()
			const args = this.args.map(this.argMapper)
			try {
				this.showNotification('Dispatched')
				const transfer = await (this as any).$http.api.tx[this.fnSection][this.fnMethod](
					...args,
				)
				const nonce = await (this as any).$http.api.query.system.accountNonce(
					this.account.address,
				)
				const alicePair = keyring.getPair(this.account.address)
				alicePair.decodePkcs8(this.password)
				console.log(await nonce.toString())
				const hash = await transfer.signAndSend(alicePair, { nonce })
				this.showNotification(hash.toHex(), this.snackbarTypes.success)
				console.log('tx', hash.toHex())
				this.tx = hash.toHex()
			} catch (e: any) {
				this.showNotification(e, this.snackbarTypes.danger)
			}

		}
	}

	private argMapper(arg: any): any {
		const accessor: string = arg.name.toString()
		// @ts-ignore: Method has always value
		return this.selectedArguments[accessor]
	}

	private showNotification(message: string | null, params = this.snackbarTypes.info) {
		this.$buefy.snackbar.open({
			duration: 5000,
			message: `${this.fnSection}:${this.fnMethod}<br>${message}`,
			position: 'is-top-right',
			queue: false,
			...params,
		})
	}

	// private getExtrinsic() {
	//   const { api } = (this as any).$http;
	//   const { method } = this;

	//   if (method) {
	//     // @ts-ignore: Method has always value
	//     const fn = api.findCall(method.callIndex);
	//     // @ts-ignore: Method has always value
	//     this.extrinsic = api.tx[fn.section][fn.method](...method.args);
	//   }
	// }
}
</script>

<style>
.executor-wrapper {
	display: flex;
}

.executor-wrapper > * {
	flex: 1;
}

.transaction.buttons {
	margin-top: 1em;
	float: right;
}

.password-wrapper {
	margin-top: 1em;
}

@media only screen and (max-width: 425px) {
	.executor-wrapper {
		flex-direction: column;
	}
}
</style>
