export function exponentialBackoff<T>(
  promiseFn: () => Promise<T>,
  maxRetries = 5,
  initialDelay = 1000,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const attempt = () => {
      promiseFn()
        .then(resolve)
        .catch((error) => {
          if (attempts++ < maxRetries) {
            const delay = initialDelay * Math.pow(2, attempts)
            setTimeout(attempt, delay)
          } else {
            reject(error)
          }
        })
    }

    attempt()
  })
}
