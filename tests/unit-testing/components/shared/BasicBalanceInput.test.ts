import { createLocalVue, mount } from '@vue/test-utils'
import Buefy from 'buefy'
import { expect, it, vi } from 'vitest'

import BasicBalanceInput from '@/components/shared/form/BasicBalanceInput.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

let wrapper, input

describe('BalanceInput.vue', () => {
  vi.useFakeTimers()

  beforeAll(() => {
    wrapper = mount(BasicBalanceInput, {
      propsData: {
        min: 10,
        max: 100,
        unit: 'KSM',
      },
      attachTo: document.body,
      mocks: {
        $t: () => '',
        $config: {
          prefix: 'rmrk',
        },
        $store: {
          getters: {
            currentUrlPrefix: 'rmrk',
          },
        },
      },
      localVue,
    })
    input = wrapper.find('[data-testid="balance-input"]')
  })

  it('should focus on input element', async () => {
    await wrapper.vm.focusInput()
    expect(input.element).toBe(document.activeElement)
  })

  it('should check input with html5validity', async () => {
    await input.setValue('0')
    expect(await wrapper.vm.checkValidity()).toBe(false)
    await input.setValue('50')
    expect(await wrapper.vm.checkValidity()).toBe(true)
    await input.setValue('900')
    expect(await wrapper.vm.checkValidity()).toBe(false)
  })

  it('should set proper value from props', async () => {
    await wrapper.setProps({ value: '1000000000000' })
    expect((input.element as HTMLInputElement).value).toBe('1')
  })

  it('should convert value based on unit', async () => {
    await input.setValue('1')
    vi.runAllTimers()
    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input?.at(-1)).toStrictEqual([
      '1000000000000',
      '1',
    ])
  })
})
