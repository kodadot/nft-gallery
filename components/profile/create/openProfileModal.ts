import ProfileCreateModal from './Modal.vue'

export const ProfileCreateModalConfig = {
  component: ProfileCreateModal,
  canCancel: ['outside'],
  rootClass: 'profile-create-modal',
  trapFocus: false,
}

export const openProfileCreateModal = (config = {}) => {
  const { neoModal } = useProgrammatic()

  neoModal.closeAll()

  return neoModal.open({
    ...ProfileCreateModalConfig,
    ...config,
    innerProps: {
      value: true,
    },
  })
}
