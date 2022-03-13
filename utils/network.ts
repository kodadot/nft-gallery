export interface NetworkStatus {
  isConnected: boolean
}

export function onNetworkStatusChange(
  callback: (status: NetworkStatus) => void
) {
  navigator.connection.addEventListener('change', () => {
    const isConnected = navigator.onLine
    callback({ isConnected })
  })
}
