<template>
	<!-- <component> -->
	<div class="block">
<!-- 		 <b-icon class="property"
	    	v-if="legalVerified"
	      size="is-medium"
	      pack="fas"
	      icon="house-user"
	    >
	  	</b-icon>
 -->
		<b-tooltip :label="email" position="is-top">
		<!-- <a href="email@email.com"> -->
			<b-icon class="property"
					v-if="emailVerified"
		      size="is-medium"
		      pack="fas"
		      icon="envelope"
		    >
		    </b-icon>
		<!-- </a> -->
		</b-tooltip>
		<b-tooltip :label="twitter" position="is-top">
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
	  	<!-- <b-icon class="property"
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
<!-- </component> -->
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
	protected id: string = '';

	public async mounted(){
		await this.fetchProfile();
	}

	protected async fetchProfile(){
		this.id = shortAddress(this.$route.params.id);
	}


	private verify(content: Property){
		// console.log(this.id, content)
		if(!content || content === this.id)
			return false;
		return true;
	}

	get emailVerified(){
		console.log(this.email);
		return this.verify(this.email);
	}

	get twitterVerified(){
		console.log(this.twitter);
		return this.verify(this.twitter);
	}

	get riotVerified(){
		return this.verify(this.riot);
	}

	get webVerified(){
		return this.verify(this.web);
	}

	get legalVerified(){
		console.log(this.legal);
		return this.verify(this.legal);
	}

};

</script>

<style>
.block{
  display: inline-flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 60%;
}
.property{
  color : #d32e79;
  vertical-align: middle;
}

</style>
