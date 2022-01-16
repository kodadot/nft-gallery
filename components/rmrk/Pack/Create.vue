<template>
  <div>
    <b-loading v-model="isLoading" is-full-page :can-cancel="true" />
    <div class="box">
      <p class="title is-size-3">Context</p>
      <p class="subtitle is-size-7">using {{ version }}</p>
      <div>
        Computed id: <b>{{ rmrkId }}</b>
      </div>
      <AccountSelect v-model="accountId" label="Account" />
      <b-field grouped label="Name">
        <b-input v-model="rmrkMint.name" expanded />
        <Tooltip :label="tooltip.name" />
      </b-field>
      <p class="title">Content</p>

      <b-field label="Description">
        <b-input v-model="meta.description" maxlength="200" type="textarea" />
      </b-field>
      <MetadataUpload v-model="image" />

      <PasswordInput v-model="password" :account="accountId" />
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        :disabled="disabled"
        :loading="isLoading"
        @click="submit">
        Create Pack
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class CreatePack extends Vue {
  private value2: any
  @Prop() public value!: any
}
</script>
