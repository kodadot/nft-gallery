// vue composables api for toast message function
export default function useToast() {
  const { $buefy } = useNuxtApp()

  // toast message function
  const toast = (message: string, type = 'is-neo') => {
    $buefy.toast.open({
      message,
      type,
    })
  }

  return {
    toast,
  }
}
