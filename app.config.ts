export default defineAppConfig({
  ui: {
    modal: {
      slots: {
        header: 'border-black border-b',
      },
      variants: {
        fullscreen: {
          false: {
            content: 'rounded-none border max-w-[25rem] shadow-primary ring-0',
          },
        },
      },
    },
  },
})
