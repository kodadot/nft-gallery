<template>
  <div class="content">
    <div class="content-headline has-text-centered">
      <h1 class="title is-1">KodaDot Blog</h1>
      <div class="subtitle has-text-weight-medium">
        Let’s Explore The NFT Universe
      </div>
    </div>

    <!-- find design in #6419 -->
    <!-- <div class="hero-card content-list">
      <img :src="posts[0].attributes.image" :alt="posts[0].attributes.title" />

      <div class="content-list-card">
        <div>
          <div class="card-tag">• {{ posts[0].attributes.tags }}</div>
          <div class="title is-3">{{ posts[0].attributes.title }}</div>
          <div class="truncate mb-4">{{ posts[0].attributes.subtitle }}</div>
        </div>

        <div>
          <NeoButton
            no-shadow
            rounded
            tag="a"
            :href="getPermalink(posts[0])"
            icon="arrow-right-long">
            View Article
          </NeoButton>
        </div>
      </div>
    </div> -->

    <div
      v-for="post in posts"
      :key="post.attributes.title"
      class="hero-card content-list mb-5">
      <img :src="post.attributes.image" :alt="post.attributes.title" />

      <div class="content-list-card">
        <div>
          <div class="card-tag">• {{ post.attributes.tags }}</div>
          <div class="title is-3 mb-4">{{ post.attributes.title }}</div>
          <div class="truncate mb-4">{{ post.attributes.subtitle }}</div>
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

      return fileName
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
    h1 {
      letter-spacing: -0.02em;
      @include ktheme() {
        color: theme('text-color-inverse');
        text-shadow: 1px 1px 0 theme('text-color'),
          1px -1px 0 theme('text-color'), -1px 1px 0 theme('text-color'),
          -1px -1px 0 theme('text-color'), 1px 0px 0 theme('text-color'),
          0px 1px 0 theme('text-color'), -1px 0px 0 theme('text-color'),
          0px -1px 0 theme('text-color'), 4px 4px theme('text-color');
      }
    }

    .subtitle {
      font-size: 1.5rem;
      margin-bottom: 5rem;
    }

    @include touch {
      h1 {
        font-size: 2rem;
      }

      .subtitle {
        font-size: 1rem;
        margin-bottom: 2.5rem;
      }
    }
  }

  &-list {
    border-radius: 2.5rem;
    overflow: hidden;
    display: flex;
    height: 22rem;

    @include touch {
      height: auto;
    }

    img {
      width: 40rem;
      max-height: 22rem;
    }

    &-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem;

      .card-tag {
        @include ktheme() {
          color: theme('k-grey-fix');
        }
      }

      .truncate {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
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
