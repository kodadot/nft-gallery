<template>
  <b-field class="mb-0">
    <b-input
      placeholder="Search..."
      type="search"
      v-model="search"
      icon="search"
      expanded>
    </b-input>
  </b-field>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default class SearchBar extends Vue {
	public search: string = "";
}
</script>