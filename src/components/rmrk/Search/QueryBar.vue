<template>
  <div class="card p-2 mt-4">
    <b-button
      v-for="(queryTag, key) in queryTags"
      v-bind:key="key"
      @click="selectQuery(queryTag)"
      :type="selectedQuery == queryTag ? 'is-link' : 'is-primary'"
      class="mr-2 my-2"
    >
      {{ queryTag }}
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";
import { QueryTags } from "./helper";

@Component({})
export default class QueryBar extends Vue {
	private queryTags = QueryTags;
	private selectedQuery: string = "";

	@Emit("selectQuery")
	public selectQuery(query: string) {
		this.selectedQuery = query;
		return query;
	}
}
</script>

<style lang="scss" scoped>
.card {
	box-shadow: 0px 0px 5px 0.5px #d32e79;
}
</style>