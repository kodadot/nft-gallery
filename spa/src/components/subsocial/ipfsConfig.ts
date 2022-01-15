
const ipfsReadOnlyNodeUrl = process.env.VUE_APP_IPFS_READ_ONLY_NODE_URL || 'http://localhost:8080'
const port = process.env.VUE_APP_OFFCHAIN_SERVER_PORT || ''

// Connect to IPFS daemon API server
export const ipfsConfig = {
  ipfsNodeUrl: ipfsReadOnlyNodeUrl,
  offchainUrl: port
}

export default ipfsConfig
