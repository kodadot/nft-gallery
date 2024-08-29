<template>
  <div
    v-if="isDesktop"
    class="flex gap-3 py-[.6rem]"
  >
    <div class="flex-1 is-clipped">
      <div class="flex items-center">
        <nuxt-link
          :to="`/${urlPrefix}/gallery/${offer.desired.id}`"
          class="h-[50px]"
        >
          <BaseMediaItem
            class="border border-k-shade w-[3.125rem] h-[3.125rem]"
            alt="offer.Item.name"
            :src="image"
            :animation-src="!image ? animationUrl : undefined"
            preview
            is-detail
          />
        </nuxt-link>
        <nuxt-link
          class="is-ellipsis inline-block"
          :to="`/${urlPrefix}/gallery/${offer.desired.id}`"
        >
          <span class="ml-5 font-bold is-clipped">
            {{ nameWithIndex(offer.desired.name, offer.desired.sn) }}
          </span>
        </nuxt-link>
      </div>
    </div>

    <div class="w-1/12">
      <div class="h-[50px] flex items-center">
        <EventTag
          :interaction="'LIST'"
          :interaction-name="interactionName"
          distinguish-buy-and-sell
        />
      </div>
    </div>

    <div class="flex-1 is-ellipsis">
      <div class="h-[50px] flex items-center">
        <div v-if="parseInt(offer.price)">
          <CommonTokenMoney :value="offer.price" />
        </div>
        <div v-else>
          {{ blank }}
        </div>
      </div>
    </div>

    <div
      class="flex-1"
    >
      <div class="h-[50px] flex items-center gap-2">
        <ProfileAvatar
          :size="24"
          :address="offer.desired.currentOwner"
        />

        <nuxt-link
          :to="`/${urlPrefix}/u/${offer.desired.currentOwner}`"
          class="text-k-blue hover:text-k-blue-hover"
        >
          <IdentityIndex
            :address="offer.desired.currentOwner"
          />
        </nuxt-link>
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <div v-if="offer.expirationDate">
          <span> {{ format(offer.expirationDate, EXPIRATION_FORMAT) }}</span>
          <span class="text-k-grey ml-3"> ({{ formatToNow(offer.expirationDate, false) }})</span>
        </div>
        <span v-else>
          {{ blank }}
        </span>
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <OfferOwnerButton
          class="max-md:!w-full"
          :offer="offer"
        />
      </div>
    </div>
  </div>
  <!-- Mobile -->
  <div
    v-else
    class="mb-6 flex flex-col"
  >
    <div class="flex flex-col gap-[10px]">
      <div class="flex h-[70px] leading-[1]">
        <nuxt-link :to="`/${urlPrefix}/gallery/${offer.desired.id}`">
          <div class="mr-5">
            <BaseMediaItem
              class="border border-k-shade w-[4.375rem] h-[4.375rem]"
              alt="offer.Item.name"
              :src="image"
              :animation-src="!image ? animationUrl : undefined"
              preview
              is-detail
            />
          </div>
        </nuxt-link>
        <div class="flex flex-col justify-center gap-[10px] flex-grow">
          <nuxt-link
            class="is-ellipsis inline-block w-60"
            :to="`/${urlPrefix}/gallery/${offer.desired.id}`"
          >
            <span class="font-bold">
              {{ nameWithIndex(offer.desired.name, offer.desired.sn) }}
            </span>
          </nuxt-link>

          <EventTag
            :interaction="'LIST'"
            :interaction-name="interactionName"
            distinguish-buy-and-sell
          />
        </div>
      </div>

      <div v-if="parseInt(offer.price)">
        <CommonTokenMoney :value="offer.price" />
      </div>
      <div v-else>
        {{ blank }}
      </div>
      <div v-if="offer.expirationDate">
        <span> {{ format(offer.expirationDate, EXPIRATION_FORMAT) }}</span>
        <span class="text-k-grey ml-3"> ({{ formatToNow(offer.expirationDate, false) }})</span>
      </div>
      <span v-else>
        {{ blank }}
      </span>

      <div class="flex gap-4">
        <div
          class="flex items-center"
        >
          <span class="text-xs mr-3">{{ $t('activity.event.to') }}:</span>
          <div class="flex items-center gap-2">
            <ProfileAvatar
              :size="24"
              :address="offer.desired.currentOwner"
            />
            <nuxt-link
              :to="`/${urlPrefix}/u/${offer.desired.currentOwner}`"
              class="text-k-blue hover:text-k-blue-hover"
            >
              <IdentityIndex
                :address="offer.desired.currentOwner"
              />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <OfferOwnerButton
      class="max-md:!w-full !mt-4"
      :offer="offer"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { formatToNow } from '@/utils/format/time'
import {
  blank,
  interactionNameMap,
} from '@/components/collection/activity/events/eventRow/common'
import EventTag from '@/components/collection/activity/events/eventRow/EventTag.vue'
import CommonTokenMoney from '@/components/shared/CommonTokenMoney.vue'
import { nameWithIndex } from '@/utils/nft'

const EXPIRATION_FORMAT = 'dd.MM. HH:MM'

const props = defineProps<{
  offer: NFTOfferItem
  variant: 'Desktop' | 'Touch'
}>()

const { urlPrefix } = usePrefix()
const image = ref()
const animationUrl = ref()
const isDesktop = computed(() => props.variant === 'Desktop')

const interactionName = computed(
  () =>
    interactionNameMap({ distinguishBuyAndSell: true })['LIST'],
)

// const getAvatar = async () => {
//   if (props.offer.Item) {
//     const meta = await getNftMetadata(props.offer.Item, urlPrefix.value)
//     image.value = meta.image
//     animationUrl.value = meta.animationUrl
//   }
// }

// onBeforeMount(getAvatar)
</script>
