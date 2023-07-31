<template>
  <div class="content">
    <div class="content-headline">
      <h1>KodaDot Blog</h1>
      <p>Let’s explore the NFT universe</p>
    </div>

    <div
      v-for="post in posts"
      :key="post.attributes.title"
      class="content-list mb-5">
      <img :src="post.attributes.image" :alt="post.attributes.title" />

      <div class="content-list-card">
        <div>
          <div class="has-text-grey">{{ post.attributes.tags }}</div>
          <div class="content-list-card-title">{{ post.attributes.title }}</div>
          <div>{{ post.attributes.subtitle }}</div>
        </div>

        <div>
          <NeoButton
            no-shadow
            rounded
            tag="a"
            :href="getPermalink(post)"
            icon="arrow-right-long">
            View Article
          </NeoButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NeoButton } from '@kodadot1/brick'

export default {
  name: 'BlogList',
  components: {
    NeoButton,
  },
  asyncData() {
    const resolve = require.context('~/content/blog/', true, /\.md$/)
    const imports = resolve.keys().map((key) => resolve(key))

    return {
      posts: imports,
    }
  },
  methods: {
    getPermalink(post) {
      const filePath = post.meta.resourcePath
      const fileName = filePath.match(/\/([^/]+)\.\w+$/)[1]

      return `/blog/${fileName}`
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/abstracts/variables';

.content {
  margin: 0 auto;
  max-width: 60rem;

  &-headline {
    text-align: center;

    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      color: #fff !important;
      text-shadow: 1px 1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
        -1px -1px 0 #000, 1px 0 0 #000, 0 1px 0 #000, -1px 0 0 #000,
        0 -1px 0 #000, 4px 4px #000;
    }

    p {
      font-size: 1.5rem;
      font-weight: 500;
      margin-bottom: 5rem;
    }

    @include touch {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
        margin-bottom: 2.5rem;
      }
    }
  }

  &-list {
    border-radius: 2.5rem;
    overflow: hidden;
    display: flex;

    img {
      width: 40rem;
      max-height: 20rem;
    }

    &-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem;

      &-title {
        font-size: 31px;
        font-weight: 700;
        margin-bottom: 1rem;
      }
    }

    @include ktheme() {
      background-color: theme('k-white');
      border: 1px solid theme('border-color');
      box-shadow: 4px 4px 0px 0px theme('border-color');

      img {
        border-right: 1px solid theme('border-color');
      }
    }

    @include touch {
      flex-direction: column;

      img {
        border-right: none !important;
        width: 100%;
      }

      &-card {
        &-title {
          font-size: 1.5rem;
        }
      }

      .o-btn {
        margin-top: 1rem;
      }
    }
  }
}
</style>
