type Task = () => Promise<void>

const taskQueue: Task[] = []
let isProcessing = false

export const processQueue = async (
  batchSize: number,
  gap: number,
): Promise<void> => {
  if (taskQueue.length === 0 || isProcessing) {
    return
  }

  isProcessing = true

  const currentBatch = taskQueue.splice(0, batchSize)
  await Promise.all(currentBatch.map((task) => task()))

  setTimeout(() => {
    isProcessing = false
    processQueue(batchSize, gap)
  }, gap)
}

export const addToQueue = (task: Task) => {
  taskQueue.push(task)
}
