<template>
  <div>
    <LinkResolver
      class="flex items-center"
      :route="`/${urlPrefix}/u`"
      :param="address"
      link="u">
      <Identity v-if="address" :address="address" />
      <template #extra>
        <Avatar :size="avatarSize" :value="address" class="mr-2" />
      </template>
    </LinkResolver>
    <template v-if="showTwitter">
      <Identity
        v-if="address"
        :address="address"
        :show-twitter="showTwitter"
        :show-discord="showDiscord"
        class="pt-2" />
    </template>
  </div>
</template>

<script setup lang="ts">
import LinkResolver from '@/components/shared/LinkResolver.vue'
import Identity from '@/components/identity/IdentityIndex.vue'
import Avatar from '@/components/shared/Avatar.vue'

const { urlPrefix } = usePrefix()

defineProps({
  address: { type: String, default: '' },
  showTwitter: { type: Boolean, default: false },
  showDiscord: { type: Boolean, default: false },
  avatarSize: { type: Number, default: 24 },
})
</script>

<style scoped>
.subscan__less-margin {
  margin: auto 0.5em auto 0;
}
</style>
