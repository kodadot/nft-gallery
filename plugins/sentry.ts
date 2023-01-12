import * as Sentry from '@sentry/browser'

// docs: https://docs.sentry.io/platforms/javascript/guides/vue/session-replay/
export default function () {
  return [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ]
}
