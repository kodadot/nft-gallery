export type SessionState = {
  state: LoadingNotificationState
  error?: Error
}

type Session = Ref<SessionState>

export default () => {
  const { add: generateSession, get: getSession } = useIdMap<Session>()
  const lastSessionId = ref<string>()

  const updateSession = (id: string, newSession: SessionState) => {
    const session = getSession(id)

    if (!session) {
      return
    }

    session.value = newSession
  }

  const notification = (
    callback: (params: { notify: typeof loadingMessage, isSessionState: (state: LoadingNotificationState) => boolean, session: Session }) => void,
  ) => {
    const sessionId = generateSession(ref({ state: 'loading' }))
    const session = getSession(sessionId)

    if (!session) {
      return
    }

    lastSessionId.value = sessionId
    const isSessionState = (state: LoadingNotificationState) => session.value?.state === state
    callback({ isSessionState, notify: loadingMessage, session })
  }

  return {
    notification,
    updateSession,
    lastSessionId,
  }
}
