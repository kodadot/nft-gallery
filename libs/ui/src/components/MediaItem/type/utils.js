import { reactive } from 'vue'

export const store = reactive({
  queue: Promise.resolve(),
  getItem(key) {
    return new Promise((resolve) => {
      this.queue = this.queue.then(() => {
        resolve(localStorage.getItem(key))
      })
    })
  },
  setItem(key, value) {
    return new Promise((resolve) => {
      this.queue = this.queue.then(() => {
        localStorage.setItem(key, value)
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
    let video = document.createElement('video')
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.addEventListener(
      'loadedmetadata',
      function () {
        video.currentTime = seekTime
      },
      false
    )

    video.addEventListener(
      'seeked',
      function () {
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
        let img = canvas.toDataURL()
        resolve(img)
      },
      false
    )

    video.addEventListener('error', function () {
      reject('Error loading video')
    })
  })
}
