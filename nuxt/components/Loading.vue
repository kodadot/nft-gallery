<template>
  <div id="app">
    <div class="preloader-container">
      <div class="preloader">
        <object
          type="image/svg+xml"
          data="kodadot_preloader_1.svg"
        >
          KodaDot preloader
        </object>
        <br>
        <span class="preloader-text">
          🔌 Charging Kusama<br>
          🖼 🥽 NFT Market Explorer
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'

export default class Loading extends Vue {
}
</script>

<style lang="scss">
.preloader {
  text-align: center;
  padding: 0 0.5rem;
}

.preloader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  color: #fff;
  z-index: 1001;
  font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
}

.preloader-text {
  display: inline-block;
  justify-content: center;
  font-size: 1.25em;
  margin-top: 0.5rem;
}

.preloader-text::after {
  content: ' _';
  animation: blink 0.3s infinite;
}

.preloader-image {
  max-width: 100%;
}
</style>
