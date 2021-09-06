<template>
	<div class="d-flex flex-row">
 		<span v-for="(item, index) in icons" :key="index">
		<b-tooltip class="p-2"
		 v-if="icons[index].icon !== 'twitter'"
		 :label="icons[index].label"
		  position="is-top"
		  v-clipboard:copy="icons[index].label"
		  >
			<b-icon class="property"
		      :size="icons[index].size"
		      :pack="icons[index].pack"
		      :icon="icons[index].icon"
		  		@click.native="toast('Copied to clipboard')"
		    >
		    </b-icon>
		</b-tooltip>
		<b-tooltip class="p-2"
		 v-else
		 :label="icons[index].label"
		  position="is-top"
		  >
			<b-icon class="property"
		      :size="icons[index].size"
		      :pack="icons[index].pack"
		      :icon="icons[index].icon"
		  		@click.native="navigateToTwitter(icons[index].label)"
		    >
		    </b-icon>
		</b-tooltip> 			
 		</span>
	</div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch} from 'vue-property-decorator';
import shortAddress from '@/utils/shortAddress';

type Property = string | undefined;

const components = {
	// Identity: () => import('@/components/shared/format/Identity.vue'),
}

@Component({ components })

export default class OnChainProperty extends Vue{

	@Prop() public twitter!: string;
	@Prop() public email!: string;
	@Prop() public web!: string ;
	@Prop() public riot!: string ;
	@Prop() public legal!: string ;
	public icons: any = [];
	protected id: string = '';

	public async created(){
		await this.fetchProfile();
	}

	protected async fetchProfile(){
		this.id = shortAddress(this.$route.params.id);

		this.legalVerified();
		this.emailVerified();
		this.twitterVerified();
		this.webVerified();
		this.riotVerified();
	}	


	private verify(content: Property){
		if(!content || content === this.id)
			return false;
		return true;
	}

	private emailVerified(){
		if(this.verify(this.email)){
			this.icons.push({
				'label': this.email,
				'pack': 'fas',
				'icon': 'envelope',
				'size': 'is-large',
			});
		}
	}

	private twitterVerified(){
		if(this.verify(this.twitter)){
			this.icons.push({
				'label': this.twitter,
				'size': 'is-large',
				'pack': 'fab',
				'icon': 'twitter',
			});
		}
	}

	private riotVerified(){
		if(this.verify(this.riot)){
			this.icons.push({
				'label': this.riot,
				'pack': 'fas',
				'icon': 'comment-alt',
				'size': 'is-large',
			});
		}
	}

	private webVerified(){
		if(this.verify(this.web)){
			this.icons.push({
				'label': this.web,
				'pack': 'fas',
				'icon': 'globe',
				'size': 'is-large',
			});
		}
	}

	private legalVerified(){
		if(this.verify(this.legal)){
			this.icons.push({
				'label': this.legal,
				'pack': 'fas',
				'icon': 'user',
				'size': 'is-large',
			});
		}
	}

	public toast(message: string): void {
		this.$buefy.toast.open(message);
  	}

	public navigateToTwitter(handle: string): void {
		window.open('https://twitter.com/' + handle.replace(/@/, ''), '_blank');
	}

	@Watch('legal')
	async watchLegal(newLegal: string, oldLegal: string){
		this.legalVerified();
	}

  @Watch('email')
  async watchEmail(newEmail: string, oldEmail: string){
  	this.emailVerified();
  }

  @Watch('twitter')
  async watchTwitter(newTwitter: string, oldTwitter: string){
  	this.twitterVerified();
  }

  @Watch('web')
  async watchWeb(newWeb: string, oldWeb: string){
  	this.webVerified();
  }

  @Watch('riot')
  async watchRiot(newRiot: string, oldRiot: string){
  	this.riotVerified();
  }


};

</script>

<style>
.property{
  color : #d32e79;
  display: flex;
  align-items: flex-start;
}

</style>
