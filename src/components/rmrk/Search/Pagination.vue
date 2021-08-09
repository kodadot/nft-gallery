<template>
  <b-pagination
    :total="total"
    :current.sync="current"
    :range-before="3"
    :range-after="3"
    :simple="simple"
    :per-page="perPage"
    order=""
    tag="a"
    aria-next-label="Next page"
    aria-previous-label="Previous page"
    aria-page-label="Page"
    aria-current-label="Current page"
    @change="scrollTop"
  >
  </b-pagination>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Pagination extends Vue {
	@Prop() value!: number;
	@Prop() public total!: number;
	@Prop(Boolean) simple!: boolean;
	@Prop({ default: 20 }) public perPage!: number;
	@Prop(Boolean) replace!: boolean;

	public scrollTop() {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	get current() {
		return this.value;
	}

	set current(value: number) {
		this.$emit("input", value);
	}
}
</script>
