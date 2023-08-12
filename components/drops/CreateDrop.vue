<template>
  <div class="drop-card border card-border-color">
    <div class="svg-icons">
      <img :src="createdDrop1" class="svg-one" />
      <img :src="createdDrop2" class="svg-two" />
      <img :src="Ellipse" class="ellipse" />
      <img :src="createdDrop3" class="svg-three" />
      <img :src="Vector" class="vector" />
      <img :src="createdDrop4" class="svg-four" />
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
  </div>
</template>
<script setup lang="ts">
import createdDrop1 from '@/assets/drops/create_drop1.svg'
import createdDrop2 from '@/assets/drops/create_drop2.svg'
import createdDrop3 from '@/assets/drops/create_drop3.svg'
import createdDrop4 from '@/assets/drops/create_drop4.svg'
import Ellipse from '@/assets/drops/Ellipse_36.svg'
import Vector from '@/assets/drops/Vector_24.svg'
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
    .svg-icons img {
      stroke: k-black;
    }
    .neo-button {
      background-color: rgba(255, 240, 248, 1);
      .dark-mode & {
        color: rgb(45, 45, 45);
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
  background-color: white;
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
  padding: 4px 10px;
  transition: color 0.3s ease;
}
</style>
