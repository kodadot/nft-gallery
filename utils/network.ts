export interface NetworkStatus {
  isConnected: boolean
}

export function onNetworkStatusChange(
  callback: (status: NetworkStatus) => void
) {
  const updateNetworkStatus = () => {
    callback({ isConnected: navigator.onLine })
  }
  window.addEventListener('offline', updateNetworkStatus)
  window.addEventListener('online', updateNetworkStatus)
}
