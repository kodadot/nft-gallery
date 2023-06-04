<template>
  <div>
    <div v-if="showExplainerText && isLogIn" class="mb-2">
      <small>
        {{ $t('createNftExplainer') }}
      </small>
    </div>
    <NeoSelect
      v-model="selectedCollection"
      :label="$t('collection')"
      :placeholder="$t('selectCollection')"
      :description="$t('selectCollectionDescription')"
      :options="selectOptions"
      expanded />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import { BaseMintedCollection as MintedCollection } from './types'
import { NeoField, NeoSelect } from '@kodadot1/brick'
import { useIdentityStore } from '~~/stores/identity'

const identityStore = useIdentityStore()

const isLogIn = computed(() => Boolean(identityStore.getAuthAddress))

const props = defineProps<{
  collections: MintedCollection[]
  showExplainerText?: boolean
}>()

defineEmits<{
  'update:selectedCollection': (value: MintedCollection) => void
}>()

const selectOptions = computed(() => [
  { text: '--', value: '' },
  ...props.collections.map((collection) => ({
    value: collection,
    text: collection.name || collection.id,
  })),
])

const selectedCollection = ref<MintedCollection | null>(null)
</script>

<!-- <script lang="ts">
import { Component, Prop, VModel, mixins } from 'nuxt-property-decorator'
import AuthMixin from '~/utils/mixins/authMixin'
import { BaseMintedCollection as MintedCollection } from './types'
import { NeoField, NeoSelect } from '@kodadot1/brick'



@Component({
  components: {
    NeoField,
  },
})
export default class CollectionSelect extends mixins(AuthMixin) {
  @VModel({ default: null }) selectedCollection!: MintedCollection
  @Prop({ type: Array, default: () => [] }) collections!: MintedCollection[]
  @Prop({ type: Boolean, default: false }) showExplainerText!: boolean
} -->
