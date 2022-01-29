<template>
  <a-entity>
    <a-box
      class="clickable"
      position="0.04 -0.135 0.005"
      depth="0.05"
      height="0.056"
      width="0.28"
      change-color-on-hover="color: #C62a88"
      v-bind:color="this.$brand.dark3"
      v-on:click="toggleFavorite()"
    >
      <a-troika-text
        :color="this.$brand.light2"
        position="-0 0.01 0.026"
        font-size="0.016"
        baseline="top"
        align="left"
        max-width="0.38"
        value="Toggle Favorite"
      ></a-troika-text>
    </a-box>
    <a-box
      position="-0.15 -0.135 0.005"
      depth="0.05"
      height="0.056"
      width="0.06"
      v-bind:color="favoriteColor"
    >
      <a-troika-text
        :color="this.$brand.light2"
        position="-0 0.02 0.026"
        font-size="0.05"
        baseline="top"
        align="left"
        max-width="0.38"
        value="*"
      ></a-troika-text>
    </a-box>
  </a-entity>
</template>

<script>
export default {
  components: {},
  props: {
    item: Object,
  },
  data() {
    return {
      isFavorite: null,
      hovering: false,
    };
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
    },
  },
  computed: {
    storageKey() {
      return "item_" + this.item.id;
    },
    favoriteColor() {
      if (this.isFavorite) {
        return this.$brand.green;
      } else {
        return this.$brand.dark3;
      }
    },
  },
  mounted() {
    if (localStorage[this.storageKey]) {
      const localItem = JSON.parse(localStorage[this.storageKey]);
      console.log(localItem);
      if (localItem.isFavorite) {
        console.log(localItem.isFavorite);
        this.isFavorite = localItem.isFavorite;
      }
    }
  },
  watch: {
    isFavorite(value) {
      let newItem = this.item;
      newItem["isFavorite"] = this.isFavorite;
      localStorage[this.storageKey] = JSON.stringify(newItem);
    },
  },
};
</script>
