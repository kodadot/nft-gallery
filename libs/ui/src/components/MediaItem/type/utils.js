import { reactive } from 'vue'

export const store = reactive({
  queue: Promise.resolve(),
  getItem(key) {
    return new Promise((resolve) => {
      this.queue = this.queue.then(() => {
        resolve(sessionStorage.getItem(key))
      })
    })
  },
  setItem(key, value) {
    return new Promise((resolve) => {
      this.queue = this.queue.then(() => {
        sessionStorage.setItem(key, value)
        resolve()
      })
    })
  },
})

export function getVideoThumbnail(
  videoUrl,
  seekTime = 0,
  width = 200,
  height = 200
) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.addEventListener(
      'loadedmetadata',
      () => {
        video.currentTime = seekTime
      },
      false
    )

    video.addEventListener(
      'seeked',
      () => {
        context?.drawImage(
          video,
          0,
          0,
          video.videoWidth,
          video.videoHeight,
          0,
          0,
          canvas.width,
          canvas.height
        )
        const img = canvas.toDataURL()
        resolve(img)
      },
      false
    )

    video.addEventListener('error', () => {
      reject(new Error('Error loading video'))
    })
  })
}
