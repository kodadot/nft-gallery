<template>
  <a
    href="https://form.kodadot.xyz/drop-page-interest"
    target="_blank"
    rel="noopener noreferrer"
    class="drop-card border border-border-color">
    <CreateDropGallery />
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
import CreateDropGallery from './CreateDropGallery.vue'
import { NeoButton } from '@kodadot1/brick'
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';
.drop-card {
  border: 1px solid #cecbcb;
  @apply w-[350px] h-[141px] flex items-center gap-x-10 cursor-pointer;

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

@media screen and (max-width: 600px) {
  .drop-card {
    width: 100%;
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
.neo-button {
  font-size: 16px;
  transition: color 0.3s ease;
}
</style>
