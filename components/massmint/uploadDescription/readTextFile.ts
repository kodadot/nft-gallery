export function readTextFile(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Unable to read file'))
      }
    }
    reader.onerror = () => {
      reject(new Error('Unable to read file'))
    }
    reader.readAsText(file)
  })
}
