<template>
	<div class="d-flex flex-row">
<!-- 		 <b-icon class="property"
	    	v-if="legalVerified"
	      size="is-medium"
	      pack="fas"
	      icon="house-user"
	    >
	  	</b-icon>
 -->
 		<span v-for="(item, index) in icons" :key="index">
		<b-tooltip class="p-2"
		 :label="icons[index].label"
		  position="is-top"
		  v-clipboard:copy="icons[index].label"
		  >
			<b-icon class="property"
		      :pack="icons[index].pack"
		      :icon="icons[index].icon"
		      :size="icons[index].size"
		  		@click.native="toast('Copied to clipboard')"
		    >
		    </b-icon>
		</b-tooltip> 			
 		</span>
<!-- 		<b-tooltip :label="twitter" position="is-top">
			<a :href="`https://twitter.com/${twitter}`">
		    <b-icon class="property"
		    	v-if="twitterVerified"
		      size="is-medium"
		      pack="fab"
		      icon="twitter"
		    >
		    </b-icon>
		  </a>
	  </b-tooltip>
 	  <b-tooltip :label="riot" position="is-top">
 	    <b-icon class="property"
 	    	v-if="riotVerified"
	      size="is-medium"
	      pack="fas"
	      icon="comment-alt"
	    >
	    </b-icon>
	  </b-tooltip>
	  <b-tooltip :label="web" position="is-top">
	    <b-icon class="property"
	    	v-if="webVerified"
	      size="is-medium"
	      pack="fas"
	      icon="link"
	    >
	  	</b-icon>
	  </b-tooltip>
 -->	  	<!-- <b-icon class="property"
	    	v-if="webVerified"
	      size="is-medium"
	      pack="fas"
	      icon="link"
	    >
	  	</b-icon>
	  	<b-icon class="property"
	    	v-if="webVerified"
	      size="is-medium"
	      pack="fas"
	      icon="link"
	    >
	  	</b-icon> -->
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

	// @Prop() public properties!: {[key: string]: any};
	@Prop() public twitter!: string;
	@Prop() public email!: string;
	@Prop() public web!: string ;
	@Prop() public riot!: string ;
	@Prop() public legal!: string ;
	public icons: any = [];
	protected id: string = '';

	public async mounted(){
		console.log(this.email);
		await this.fetchProfile();
	}

	protected async fetchProfile(){
		this.id = shortAddress(this.$route.params.id);
		this.emailVerified();
		this.twitterVerified();
		this.webVerified();
		this.riotVerified();
		this.legalVerified();
	}	


	private verify(content: Property){
		// console.log(this.id, content)
		if(!content || content === this.id)
			return false;
		return true;
	}

	private emailVerified(){
		console.log(this.email);
		if(this.verify(this.email)){
			this.icons.push({
				'label': this.email,
				'pack': 'fas',
				'icon': 'envelope',
				'size': 'is-medium'
			});
		}
	}

	private twitterVerified(){
		console.log(this.twitter);
		if(this.verify(this.twitter)){
			this.icons.push({
				'label': this.twitter,
				'pack': 'fab',
				'icon': 'twitter',
				'size': 'is-medium'
			});
		}
	}

	private riotVerified(){
		// console.log(this.riot);
		if(this.verify(this.riot)){
			this.icons.push({
				'label': this.riot,
				'pack': 'fas',
				'icon': 'comment-alt',
				'size': 'is-medium'
			});
		}
	}

	private webVerified(){
		// console.log(this.web);
		if(this.verify(this.web)){
			this.icons.push({
				'label': this.web,
				'pack': 'fas',
				'icon': 'link',
				'size': 'is-medium'
			});
		}
	}

	private legalVerified(){
		// console.log(this.legal);
		if(this.verify(this.legal)){
			this.icons.push({
				'label': this.legal,
				'pack': 'fas',
				'icon': 'users',
				'size': 'is-medium'
			});
		}
	}

	public toast(message: string): void {
		console.log('here');
    this.$buefy.toast.open(message);
  }

};

</script>

<style>
.property{
  color : #d32e79;
  vertical-align: top;
}

</style>
