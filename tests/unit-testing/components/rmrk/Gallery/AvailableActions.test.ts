import 'fake-indexeddb/auto'
import { createLocalVue, mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import Buefy from 'buefy'

import AvailableActions from '@/components/rmrk/Gallery/AvailableActions.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

let wrapper

describe('AvailableActions.vue', () => {
  beforeAll(() => {
    wrapper = mount(AvailableActions, {
      propsData: {
        currentOwnerId: 'bob',
        originialOwner: 'alice',
        price: '42',
        nftId: 'foo',
        isOwner: false,
      },
      attachTo: document.body,
      mocks: {
        $t: () => '',
        $config: {
          prefix: 'rmrk',
        },
        $store: {
          getters: {
            getAuthAddress: 'foo',
          },
        },
      },
      localVue,
    })
  })

  it('should disable BUY button if set buyDisabled to true through props', async () => {
    await wrapper.setProps({ buyDisabled: true })
    const buyButton = wrapper.find('[data-testid="available-actions-BUY"]')
    expect(buyButton.element.getAttribute('disabled')).toBe('disabled')
  })

  it('should not render BUY button if set price to 0 through props', async () => {
    await wrapper.setProps({ price: '0' })
    const buyButton = wrapper.find('[data-testid="available-actions-BUY"]')
    expect(buyButton.element).toBeUndefined()
  })

  it('should render LIST button if set isOwner to true through props', async () => {
    await wrapper.setProps({ isOwner: true })
    const listButton = wrapper.find('[data-testid="available-actions-LIST"]')
    expect(listButton.element).toBeDefined()
  })
})
