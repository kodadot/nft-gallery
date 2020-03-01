<template>
  <OptionDropdown
    label="Conviction"
    description="Select a lockup period"
    :options="options"
		@selected="handleSelection"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import convictionOptions, { ConvictionOption } from './convictionUtil';
import OptionDropdown from '@/components/shared/OptionDropdown.vue';


@Component({
  components: {
    OptionDropdown,
  },
})
export default class Conviction extends Vue {
	
	private options = convictionOptions();

	@Emit('selected')
	public handleSelection(value: any) {
		return { conviction: value };
	}
	

}
</script>
