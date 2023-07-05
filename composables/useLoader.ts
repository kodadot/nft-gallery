export default function () {
  const isLoading = ref(false)
  const status = ref('')

  return {
    isLoading,
    status,
  }
}
