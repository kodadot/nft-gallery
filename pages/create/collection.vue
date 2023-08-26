<template>
  <section>
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half">
          <h2 class="title is-size-3">
            {{ $t('mint.collection.create') }}
          </h2>

          <!-- select blockchain -->
          <NeoField :label="`${$t('mint.blockchain.label')} *`">
            <div>
              <p>{{ $t('mint.blockchain.message') }}</p>
              <NeoDropdown v-model="selectBlockchain" class="mt-3" expanded>
                <template #trigger>
                  <NeoButton variant="primary" type="button" expanded>
                    {{ selectBlockchain.text }}
                    <NeoIcon icon="caret-down"></NeoIcon>
                  </NeoButton>
                </template>

                <NeoDropdownItem
                  v-for="(menu, index) in menus"
                  :key="index"
                  :value="menu"
                  aria-role="listitem">
                  <div class="is-flex is-align-items-center">
                    <img
                      :src="menu.icon"
                      :alt="menu.text"
                      width="32px"
                      class="is-inline-block mr-2" />
                    <div>
                      <span>{{ menu.text }}</span>
                    </div>
                  </div>
                </NeoDropdownItem>
              </NeoDropdown>
            </div>
          </NeoField>

          <!-- collection logo -->
          <NeoField :label="`${$t('mint.collection.logo.image')} *`">
            <div>
              <p>{{ $t('mint.collection.logo.message') }}</p>
              <DropUpload
                v-model="logo"
                required
                expanded
                preview
                :label="$t('mint.collection.drop')" />
            </div>
          </NeoField>

          <!-- collection name -->
          <NeoField
            :label="`${$t('mint.collection.name.label')} *`"
            required
            :error="!name">
            <NeoInput v-model="name" required />
          </NeoField>

          <!-- collection description -->
          <NeoField
            :label="`${$t('mint.collection.description.label')} (optional)`">
            <NeoInput
              v-model="description"
              type="textarea"
              has-counter
              maxlength="1000"
              height="10rem" />
          </NeoField>

          <!-- collection max nfts -->
          <NeoField :label="$t('Maximum NFTs in collection')" required>
            <div class="w-full">
              <div class="is-flex is-justify-content-space-between">
                <p>{{ $t('mint.unlimited') }}</p>
                <NeoSwitch v-model="unlimited" />
              </div>
              <NeoInput
                v-if="!unlimited"
                v-model="max"
                class="mt-3"
                type="number"
                placeholder="1 is the minimum"
                :min="1" />
            </div>
          </NeoField>

          <hr class="my-6" />

          <!-- create collection button -->
          <NeoField variant="danger">
            <SubmitButton expanded label="create collection" />
          </NeoField>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  NeoButton,
  NeoDropdown,
  NeoDropdownItem,
  NeoField,
  NeoIcon,
  NeoInput,
  NeoSwitch,
} from '@kodadot1/brick'
import DropUpload from '@/components/shared/DropUpload.vue'
import SubmitButton from '@/components/base/SubmitButton.vue'
import { availablePrefixWithIcon } from '@/utils/chain'

const logo = ref<File | null>(null)
const name = ref('')
const description = ref('')
const unlimited = ref(true)
const max = ref(1)

const menus = availablePrefixWithIcon().filter((menu) => {
  return menu.icon
})
const selectBlockchain = ref(menus[0])

console.log(menus)
</script>

<style lang="scss">
.o-field:not(:last-child) {
  margin-bottom: 2rem;
}

.file {
  margin-bottom: 0;
}
</style>
