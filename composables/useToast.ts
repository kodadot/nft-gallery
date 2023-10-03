// vue composables api for toast message function
export default function useToast() {
  const { $neoNotification } = useNuxtApp()

  // toast message function
  const toast = (
    message: string,
    { rootClass = 'is-neo-toast', duration = 5000, position = 'top' } = {}
  ) => {
    $neoNotification.open({
      message,
      rootClass,
      duration,
      position,
    })
  }

  return {
    toast,
  }
}
