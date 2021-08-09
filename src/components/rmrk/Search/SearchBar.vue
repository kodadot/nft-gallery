<template>
  <div>
    <div class="mb-4">
      <b-input
        placeholder="Search..."
        type="search"
        v-model="search"
        icon="search"
        expanded>
      </b-input>
    </div>
    
    <div class="is-flex">
      <b-field class="mb-4 mr-4" label="MEDIUM">
        <b-select
          v-model="medium"
          expanded
        >
          <option
            v-for="mediumItem in mediums"
            v-bind:key="mediumItem"
            :value="mediumItem"
          >
            {{ mediumItem }}
          </option>
        </b-select>
      </b-field>

      <b-field class="mb-4" label="FILTERS">
        <b-select
          v-model="filter"
          expanded
        >
          <option
            v-for="filterItem in filters"
            v-bind:key="filterItem"
            :value="filterItem"
          >
            {{ filterItem }}
          </option>
        </b-select>
      </b-field>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Filters, Mediums } from "./helper";

@Component
export default class SearchBar extends Vue {
	set search(value) {
		this.$emit("selectSearch", value);
	}

	get search() {
		return "";
	}

	set medium(value) {
		this.$emit("selectMedium", value);
	}

	get medium() {
		return "";
	}

	set filter(value) {
		this.$emit("selectFilter", value);
	}

	get filter() {
		return "";
	}

	private mediums = Mediums;
	private filters = Filters;
}
</script>