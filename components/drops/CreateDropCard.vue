<template>
  <a
    href="https://form.kodadot.xyz/drop-page-interest"
    target="_blank"
    rel="noopener noreferrer"
    class="drop-card border card-border-color">
    <div class="svg-icons">
      <img src="@/assets/drops/create_drop1.svg" class="svg-one" />
      <img src="@/assets/drops/create_drop2.svg" class="svg-two" />
      <img src="@/assets/drops/BlueShade.svg" class="ellipse" />
      <img src="@/assets/drops/create_drop3.svg" class="svg-three" />
      <img src="@/assets/drops/PinkShade.svg" class="vector" />
      <img src="@/assets/drops/create_drop4.svg" class="svg-four" />
    </div>
    <div class="inner_card">
      <p>Create Your Own</p>
      <NeoButton
        tag="a"
        href="https://form.kodadot.xyz/drop-page-interest"
        target="_blank"
        variant="secondary"
        class="mt-2 neo-button">
        Drop Page
      </NeoButton>
    </div>
  </a>
</template>
<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
</script>
<style scoped lang="scss">
@import '@/styles/abstracts/variables';
.drop-card {
  width: 350px;
  height: 141px;
  display: flex;
  align-items: center;
  column-gap: 2.5rem;
  border: 1px solid #cecbcb;
  cursor: pointer;

  a:hover {
    color: unset;
  }

  &:hover {
    @include ktheme() {
      border-color: theme('border-color');
    }
    .neo-button {
      background-color: rgba(255, 240, 248, 1);

      .dark-mode & {
        color: rgba(255, 255, 255, 1);
        background-color: rgba(54, 50, 52, 1);
      }
    }
  }
  &-banner {
    height: 17rem;
    background-size: cover;
    background-repeat: no-repeat;
  }
}
.light-mode .drop-card {
  background-color: rgba(255, 255, 255);
}
.light-mode .neo-button {
  border: 1px solid rgba(0, 0, 0, 1);
}

.dark-mode .neo-button {
  border: 1px solid #cecbcb;
}
.dark-mode .inner_card {
  color: rgba(255, 255, 255);
}
.light-mode .inner_card {
  color: rgba(0, 0, 0, 1);
}
.dark-mode .inner_card .neo-button {
  border: 1px solid rgba(255, 255, 255);
}
.svg-icons {
  width: 154px;
  height: 141px;
  position: relative;
}
.svg-one {
  position: absolute;
  top: 34px;
  left: 52px;
}

.svg-two {
  position: absolute;
  top: 68.6171875px;
  left: 32px;
  z-index: 10;
}

.svg-three {
  position: absolute;
  top: 20.24px;
  left: 45px;
}

.svg-four {
  position: absolute;
  top: 19px;
  left: 98.431640625px;
}

.ellipse {
  position: absolute;
}

.vector {
  position: absolute;
  top: 20px;
  left: 50.43px;
}
.neo-button {
  font-size: 16px;
  transition: color 0.3s ease;
}
</style>
