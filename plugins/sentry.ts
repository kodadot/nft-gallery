import { Replay } from '@sentry/browser'

// docs: https://docs.sentry.io/platforms/javascript/guides/vue/session-replay/
export default function () {
  return [
    new Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ]
}
