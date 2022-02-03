import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'
import { SnackbarProgrammatic as Snackbar } from 'buefy'
import checkIndexer from '@/queries/checkIndexer.graphql'

export const state = () => ({
  indexer: {
    keyringLoaded: false,
    indexerHealthy: true,
    lastProcessedHeight: undefined,
    lastProcessedTimestamp: undefined,
  },
})

export type IndexerState = ReturnType<typeof state>

export const getters: GetterTree<IndexerState, IndexerState> = {
  getIndexer: ({ indexer }: any) => indexer,
}

export const mutations: MutationTree<IndexerState> = {
  SET_INDEXER_STATUS(state: any, data: any) {
    state.indexer = Object.assign({}, state.indexer, data)
  },
}

export const actions: ActionTree<IndexerState, IndexerState> = {
  async fetchIndexer({ commit }: { commit: Commit }, prefix: string) {
    try {
      if (!this.app.apolloProvider?.clients) {
        return
      }

      const indexer = await this.app.apolloProvider.clients[prefix].query({
        query: checkIndexer,
      })

      const {
        data: { _metadata: data },
      }: any = await indexer

      console.log(
        `%cIndexer:
        Health: ${data?.indexerHealthy ? '❤️' : '💀'}
        Last: ${new Date(Number(data?.lastProcessedTimestamp))}`,
        'background: #222; color: #bada55; padding: 0.3em'
      )
      commit('SET_INDEXER_STATUS', data)
    } catch (error) {
      const type = {
        indefinite: true,
        position: 'is-top-right',
        message: `
          <p class="title is-3">Indexer Error</p>
          <p class="subtitle">Indexer is not working properly</p>
          <p class="subtitle">If you think this should't happen, report us by
          <a target="_blank" rel="noopener noreferrer"  href="https://github.com/kodadot/nft-gallery/issues/new?assignees=&labels=bug&template=bug_report.md&title=">creating bug issue with steps to reproduce and screenshot.</a></p>
        `,
        type: 'is-danger',
        hasIcon: true,
      }
      Snackbar.open(type as any)
      console.warn('Do something', error)
    }
  },
  upateIndexerStatus({ commit }: { commit: Commit }, data: any) {
    commit('SET_INDEXER_STATUS', data)
  },
}
