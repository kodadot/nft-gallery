const sendLogToServer = async (message) => {
  try {
    await fetch('https://5a6180e17126.ngrok.app/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
  } catch (error) {
    console.error('Error sending log to server:', error)
  }
}

export const downloadImage = async (imageSrc, name = 'unnamed') => {
  if (!imageSrc) {
    await sendLogToServer('downloadImage called without imageSrc')
    return
  }

  await sendLogToServer(`Attempting to fetch image: ${imageSrc}`)

  try {
    const { data, error, status } = await useFetch(imageSrc)

    // Log response details
    await sendLogToServer(`useFetch response status: ${status.value}`)

    if (status.value === 'error') {
      await sendLogToServer(`Error in fetching: ${error.value.message}`)
      return
    }

    const imageData = data.value

    // Check and log data type
    if (!(imageData instanceof Blob)) {
      await sendLogToServer(
        `Fetched data is not a Blob, actual type: ${typeof imageData}, data: ${JSON.stringify(
          imageData,
        ).substring(0, 200)}`,
      )
      // Log only the first 200 characters to avoid sending too much data
      return
    }

    const link = document.createElement('a')
    link.href = URL.createObjectURL(imageData)
    link.download = name

    document.body.appendChild(link)
    await sendLogToServer('Link element created and appended to body')

    link.click()
    await sendLogToServer('Link clicked for download')

    document.body.removeChild(link)
    await sendLogToServer('Link element removed from body')

    return link
  } catch (error) {
    await sendLogToServer(
      `Error during fetch or download process: ${error.message}`,
    )
    return
  }
}
