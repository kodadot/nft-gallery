import { useRoute as _useRoute } from 'vue-router'

// context: auto-import useRouter is not reactive after initially being set. ref: https://github.com/kodadot/nft-gallery/issues/10757
export default function () {
  return _useRoute()
}
