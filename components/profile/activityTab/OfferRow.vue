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
          :interaction="OfferInteraction"
          :interaction-name="interactionName"
        />
      </div>
    </div>

    <div class="flex-1 is-ellipsis">
      <div class="h-[50px] flex items-center">
        <div
          v-if="parseInt(offer.price)"
          class="flex gap-2 items-center"
        >
          <span>{{ amount }}</span> <span class="text-k-grey text-sm">({{ price }})</span>
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
          :address="targetAddress"
        />

        <nuxt-link
          :to="`/${urlPrefix}/u/${targetAddress}`"
          class="text-k-blue hover:text-k-blue-hover"
        >
          <IdentityIndex
            :address="targetAddress"
          />
        </nuxt-link>
      </div>
    </div>

    <div class="flex-1">
      <div class="h-[50px] flex items-center">
        <template v-if="offer.expirationDate">
          <div v-if="isExpired">
            <span>{{ $t('expired') }}</span>
          </div>
          <div v-else>
            <span>{{ format(offer.expirationDate, EXPIRATION_FORMAT) }}</span>
            <span class="text-k-grey ml-3">({{ formatToNow(offer.expirationDate, isExpired) }})</span>
          </div>
        </template>
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
          @click="$emit('select')"
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
            :interaction="OfferInteraction"
            :interaction-name="interactionName"
          />
        </div>
      </div>

      <div
        v-if="parseInt(offer.price)"
        class="flex gap-2 items-center"
      >
        <span>{{ amount }}</span> <span class="text-k-grey text-sm">({{ price }})</span>
      </div>
      <div v-else>
        {{ blank }}
      </div>
      <template v-if="offer.expirationDate">
        <div v-if="ieExpired">
          <span>{{ $t('expired') }}</span>
        </div>
        <div v-else>
          <span>{{ format(offer.expirationDate, EXPIRATION_FORMAT) }}</span>
          <span class="text-k-grey ml-3">({{ formatToNow(offer.expirationDate, isExpired) }})</span>
        </div>
      </template>
      <span v-else>
        {{ blank }}
      </span>

      <div class="flex gap-4">
        <div
          class="flex items-center"
        >
          <span class="text-xs mr-3">{{ $t(`activity.event.${target}`) }}:</span>
          <div class="flex items-center gap-2">
            <ProfileAvatar
              :size="24"
              :address="targetAddress"
            />
            <nuxt-link
              :to="`/${urlPrefix}/u/${targetAddress}`"
              class="text-k-blue hover:text-k-blue-hover"
            >
              <IdentityIndex
                :address="targetAddress"
              />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <OfferOwnerButton
      class="max-md:!w-full !mt-4"
      :offer="offer"
      @click="$emit('select')"
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
import { nameWithIndex } from '@/utils/nft'
import { OfferInteraction } from '@/composables/collectionActivity/types'
import { fetchNft } from '@/components/items/ItemsGrid/useNftActions'

const EXPIRATION_FORMAT = 'dd.MM. HH:MM'

defineEmits(['select'])
const props = defineProps<{
  offer: NFTOfferItem
  variant: 'Desktop' | 'Touch'
  target: 'from' | 'to'
}>()

const { urlPrefix } = usePrefix()
const { format: formatPrice } = useFormatAmount()
const { amount, price } = formatPrice(props.offer?.price)

const image = ref()
const animationUrl = ref()
const isDesktop = computed(() => props.variant === 'Desktop')
const isExpired = computed(() => props.offer.status === 'EXPIRED')
const targetAddress = computed(() => props.target === 'to' ? props.offer.desired.currentOwner : props.offer.caller)

const interactionName = computed(
  () =>
    interactionNameMap()[OfferInteraction],
)

const getAvatar = async (nft) => {
  const meta = await getNftMetadata(nft, urlPrefix.value)
  image.value = meta.image
  animationUrl.value = meta.animationUrl
}

// TODO imporve nft fetching
onBeforeMount(() => fetchNft(props.offer.desired.id).then(getAvatar))
</script>
