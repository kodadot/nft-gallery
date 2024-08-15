import ProfileCreateModal from './Modal.vue'

export const ProfileCreateModalConfig = {
  component: ProfileCreateModal,
  canCancel: ['outside'],
  rootClass: 'profile-create-modal',
  trapFocus: false,
}

export const openProfileCreateModal = (skipIntro: boolean = false) => {
  const { neoModal } = useProgrammatic()

  neoModal.closeAll()

  return neoModal.open({
    ...ProfileCreateModalConfig,
    innerProps: {
      skipIntro,
    },
  })
}
