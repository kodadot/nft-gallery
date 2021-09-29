<template>
    <ModalWrapper :label="$t('subsocial.post')">
      <template v-slot:trigger="{ handleOpen }">
        <PostButton @click="handleOpen" />
      </template>
      <template v-slot:default>
        Lorem ipsum
      </template>
    </ModalWrapper>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'

const components = {
	ModalWrapper: () => import('@/components/shared/modals/ModalWrapper.vue'),
	PostButton: () => import('./PostButton.vue')
}

@Component({
	name: 'CreatePostModal',
	components
})
export default class CreatePostModal extends Vue {

  private value2: any;
  @Prop() public value!: any;
}
</script>
