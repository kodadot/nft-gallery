const useLoader = () => useState<boolean>('loader', () => false)

export default defineNuxtPlugin(() => {
  const loader = useLoader()

  return {
    provide: {
      loader,
      updateLoader(value: boolean) {
        loader.value = value
      },
    },
  }
})
