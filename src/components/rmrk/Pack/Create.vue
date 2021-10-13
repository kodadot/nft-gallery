<template>
    <div>
    <b-loading is-full-page v-model="isLoading" :can-cancel="true"></b-loading>
    <div class="box">
      <p class="title is-size-3">
        Context
      </p>
      <p class="subtitle is-size-7">
        using {{ version }}
      </p>
      <div>
        Computed id: <b>{{ rmrkId }}</b>
      </div>
      <AccountSelect label="Account" v-model="accountId" />
      <b-field grouped label="Name">
        <b-input v-model="rmrkMint.name" expanded></b-input>
        <Tooltip :label="tooltip.name" />
      </b-field>
      <p class="title">
        Content
      </p>

        <b-field label="Description">
          <b-input
            v-model="meta.description"
            maxlength="200"
            type="textarea"
          ></b-input>
        </b-field>
      <MetadataUpload v-model="image" />

      <PasswordInput v-model="password" :account="accountId" />
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        @click="submit"
        :disabled="disabled"
        :loading="isLoading"
      >
        Create Pack
      </b-button>
    </div>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class CreatePack extends Vue {

  private value2: any;
  @Prop() public value!: any;
}
</script>
