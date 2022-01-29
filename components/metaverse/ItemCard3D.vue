<template>
  <a-entity :position="currentPosition">
    <!-- Card Header - always shown -->
    <a-box
      position="0 0 0.005"
      depth="0.05"
      width="0.4"
      height="0.4"
      :color="this.$brand.dark1"
      class="clickable"
      v-on:click="toggleCardMode()"
    >
      <ItemImage3D :item="this.item" />
      <template v-if="!this.display">
        <a-box
          position="0 -0.14 0.002"
          depth="0.05"
          height="0.08"
          width="0.36"
          :material="this.headerTitleStyle"
        >
          <a-troika-text
            :color="this.$brand.light1"
            position="-0 0 0.026"
            font-size="0.022"
            align="left"
            max-width="0.34"
            :value="this.trimString(item.description, 90)"
          ></a-troika-text>
        </a-box>
      </template>
    </a-box>
    <!-- Card Details - select to show -->
    <template v-if="this.display">
      <a-box
        position="0 -0.40 0.005"
        depth="0.05"
        height="0.4"
        width="0.4"
        :color="this.$brand.dark1"
      >
        <a-troika-text
          :color="this.$brand.light1"
          position="-0 0.17 0.026"
          font-size="0.018"
          align="left"
          max-width="0.36"
          :value="this.trimString(item.description, 96)"
        ></a-troika-text>
        <a-box
          position="0 0.115 0.025"
          depth="0.01"
          height="0.001"
          width="0.36"
          :color="this.$brand.dark3"
        >
        </a-box>
        <a-troika-text
          :color="this.$brand.light2"
          position="-0 0.1 0.026"
          font-size="0.016"
          baseline="top"
          align="left"
          max-width="0.36"
          :value="this.trimString(item.description, 256)"
        ></a-troika-text>
        <!-- Favorite Toggle button and indicator -->
        <!-- <ItemFavorite3D :item="item" /> -->
      </a-box>
    </template>
  </a-entity>
</template>

<script>
import ItemImage3D from "./ItemImage3D";
import ItemFavorite3D from "./ItemFavorite3D";
export default {
  components: {
    ItemImage3D,
    ItemFavorite3D,
  },
  props: {
    item: Object,
    startPosition: String,
  },
  data() {
    return {
      isFavorite: null,
      display: false,
    };
  },
  methods: {
    trimString(value, maxChar) {
      
      // TODO: Replace this with something that can truncate after the end of a word
      const length = value.length;
      if (length >= maxChar + 3) {
        return value.substring(0, maxChar - 3) + "...";
      } else {
        return value;
      }
    },
    toggleCardMode() {
      this.display = !this.display;
    },
  },
  computed: {
    currentPosition() {
      if (this.display) {
        return "0 1.7 0.4";
      } else {
        return this.startPosition;
      }
    },
    headerTitleStyle() {
      return (
        "color: " + this.$brand.dark3 + "; "
        // "color: " + this.$brand.light1 + "; opacity: 0.1; transparent: true"
      );
    },
  },
};
</script>

