export const preloadImage = (src: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const image = new Image()
      image.src = src

      const onLoad = () => {
        resolve(true)
      }

      image.addEventListener('load', onLoad, true)

      image.removeEventListener('load', onLoad)
    } catch (e) {
      reject(e)
    }
  })
}
