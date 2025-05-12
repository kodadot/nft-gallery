export default defineAppConfig({
  ui: {
    modal: {
      slots: {
        header: 'border-black border-b',
      },
      variants: {
        fullscreen: {
          false: {
            content: 'rounded-none border max-w-[23rem] shadow-primary ring-0',
          },
        },
      },
    },
  },
})
