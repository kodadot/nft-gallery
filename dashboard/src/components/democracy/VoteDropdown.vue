<template>
<OptionDropdown
    label="Vote"
    description="Select a decision"
    :options="options"
		@selected="handleSelection"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import OptionDropdown from '@/components/shared/OptionDropdown.vue';


@Component({
  components: {
    OptionDropdown,
  },
})
export default class VoteDropdown extends Vue {
	 private options: any[] = [
		{  text: 'Yes I approve', value: true },
		{  text: 'No, I do not approve', value: false },
	];

	@Emit('selected')
	public handleSelection(value: any) {
		return { aye: value };
	}
}
</script>
