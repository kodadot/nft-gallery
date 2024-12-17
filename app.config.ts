export default defineAppConfig({
  ui: {
    carousel: {
      item: 'snap-start',
      default: {
        prevButton: {
          class: 'absolute top-1/2 -translate-y-1/2 -left-6 bg-white size-14 rounded-full hidden lg:flex disabled:hidden items-center justify-center border-black border shadow-[4px_4px] text-4xl text-black dark:text-white hover:bg-k-primary-light',
          icon: 'i-heroicons-chevron-left',
        },
        nextButton: {
          class: 'absolute top-1/2 -translate-y-1/2 -right-6 bg-white size-14 rounded-full hidden lg:flex disabled:hidden items-center justify-center border-black border shadow-[4px_4px] text-4xl text-black dark:text-white hover:bg-k-primary-light',
          icon: 'i-heroicons-chevron-right',
        },
      },
    },
  },
})
