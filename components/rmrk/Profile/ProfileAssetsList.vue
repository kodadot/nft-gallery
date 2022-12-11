<template>
  <div class="profile-assets-list">
    <div class="is-flex is-justify-content-space-between">
      <div class="has-text-left has-text-grey is-size-7">
        {{ 'Asset' }}
      </div>
      <div class="has-text-left has-text-grey is-size-7">
        {{ 'Balance' }}
      </div>
      <div class="has-text-left has-text-grey is-size-7">
        {{ 'USD' }}
      </div>
    </div>
    <hr class="my-2" />
    <div>
      {{ assetList }}
      <!--      <SimpleAccountBalance-->
      <!--        v-for="token in tokens"-->
      <!--        :key="token"-->
      <!--        class="is-size-6"-->
      <!--        :token-id="token" />-->
    </div>
  </div>
</template>
