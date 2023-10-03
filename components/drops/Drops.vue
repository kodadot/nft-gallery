<template>
  <div>
    <h1 class="title is-2 mb-7">
      {{ $i18n.t('drops.title') }}
    </h1>
    <div v-if="drops.drops.length" class="grid-container">
      <div
        v-for="(drop, index) in drops.drops"
        :key="`${drop.collection?.id}=${index}`"
        class="w-full h-full"
        :data-testid="index">
        <DropCard :drop="drop" override-url-prefix="ahp" />
      </div>
      <template v-if="statemintDrops.drops.length">
        <div
          v-for="(drop, index) in statemintDrops.drops"
          :key="`${drop.collection?.id}=${index}`"
          class="w-full h-full"
          :data-testid="index">
          <DropCard
            :drop="drop"
            override-url-prefix="ahp"
            drop-url="dot-drop" />
        </div>
      </template>
      <template v-if="voteDrop?.drops?.length">
        <div
          v-for="(drop, index) in voteDrop.drops"
          :key="`${drop.collection?.id}=${index}`"
          class="w-full h-full"
          :data-cy="index">
          <DropCard
            :drop="drop"
            override-url-prefix="ahk"
            drop-url="vote-drop" />
        </div>
      </template>
      <template v-if="voteDropAhp?.drops?.length">
        <div
          v-for="(drop, index) in voteDropAhp.drops"
          :key="`${drop.collection?.id}=${index}`"
          class="w-full h-full"
          :data-cy="index">
          <DropCard
            :drop="drop"
            override-url-prefix="ahp"
            drop-url="vote-drop" />
        </div>
      </template>
    </div>
    <div class="title is-2 my-7">
      {{ $i18n.t('drops.upcoming') }}
    </div>
    <div v-if="drops.futureDrops.length" class="grid-container">
      <div
        v-for="(drop, index) in drops.futureDrops"
        :key="`${drop.collection?.id}=${index}`"
        class="w-full h-full"
        :data-testid="index">
        <DropCard :drop="drop" />
      </div>
    </div>
    <div v-else class="title is-4 has-text-grey has-text-centered">
      {{ $i18n.t('drops.noUpcoming') }}
    </div>
    <hr />
    <div>
      <CreateDropCard />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DropCard from '@/components/drops/DropCard.vue'
import CreateDropCard from '@/components/drops/CreateDropCard.vue'
import { collectionId } from '@/components/collection/unlockable/const'
import { STT_COLLECTION_ID } from '@/components/collection/drop/const'
import {
  VOTE_DROP_AHP_COLLECTION_ID,
  VOTE_DROP_COLLECTION_ID,
} from '@/components/collection/voteDrop/const'
import { useDrops } from './useDrops'
import { dropsVisible } from '@/utils/config/permission.config'

const { $i18n } = useNuxtApp()
const drops = useDrops(collectionId, 'ahp')
const statemintDrops = useDrops(STT_COLLECTION_ID, 'ahp')
const voteDrop = useDrops(VOTE_DROP_COLLECTION_ID, 'ahk')
const voteDropAhp = useDrops(VOTE_DROP_AHP_COLLECTION_ID, 'ahp')
const { urlPrefix } = usePrefix()

const checkRouteAvailability = () => {
  if (!dropsVisible(urlPrefix.value)) {
    navigateTo('/')
  }
}

watch(urlPrefix, () => checkRouteAvailability())

onBeforeMount(() => {
  checkRouteAvailability()
})
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
