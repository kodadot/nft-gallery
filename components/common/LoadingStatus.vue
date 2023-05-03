<template>
  <section>
    <article v-for="i in media" :key="i" class="media">
      <figure class="media-left">
        <p class="image is-64x64">
          <b-skeleton circle width="64px" height="64px"></b-skeleton>
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <p>
            <b-skeleton active></b-skeleton>
            <b-skeleton height="80px"></b-skeleton>
          </p>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      media: 1,
    }
  },
}
</script>
