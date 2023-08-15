<template>
  <div class="columns is-multiline">
    <div
      v-for="item in qrCodeList"
      :key="item.title"
      class="column is-half has-text-centered mb-3">
      <a :href="item.link">{{ item.title }}</a>
      <img :src="item.img" class="is-half px-8 mt-2" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const qrCodeList = [
  {
    title: 'Discord',
    img: '/qrCode/discord.png',
    link: 'https://discord.gg/u6ymnbz4PR',
  },
  {
    title: 'Twitter',
    img: '/qrCode/twitter.png',
    link: 'https://twitter.com/KodaDot',
  },
  {
    title: 'Github',
    img: '/qrCode/github.png',
    link: 'https://github.com/kodadot/nft-gallery',
  },
  {
    title: 'Instagram',
    img: '/qrCode/instagram.png',
    link: 'https://instagram.com/kodadot.xyz',
  },
]
</script>
