import { createLocalVue, mount } from '@vue/test-utils'
import Buefy from 'buefy'
import { expect, it, vi } from 'vitest'

import { units } from '@/params/constants'
import BalanceInput from '@/components/shared/BalanceInput.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

let wrapper, input, options

describe('BalanceInput.vue', () => {
  vi.useFakeTimers()

  beforeAll(() => {
    ;(window as any).usePrefix = () => ({
      urlPrefix: {
        value: 'rmrk',
      },
    })
    wrapper = mount(BalanceInput, {
      propsData: {
        min: 10,
        max: 100,
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
        $route: {
          params: {
            prefix: 'rmrk',
          },
        },
      },
      localVue,
    })
    input = wrapper.find('[data-testid="balance-input"]')
    options = wrapper
      .find('[data-testid="balance-input-select"]')
      .findAll('option')
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
    await wrapper.setProps({ value: 3 })
    expect((input.element as HTMLInputElement).value).toBe('3')
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

  it('should convert value based on selected unit', async () => {
    await options.at(6).setSelected()
    await input.setValue('2')
    expect(wrapper.find('option:checked').element.textContent).toBe(' Kilo ')
    vi.runAllTimers()
    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input?.at(-1)).toStrictEqual([
      '2000000000000000000',
      '2',
    ])
  })

  it('should not calculate the unit if set calculate to false through props', async () => {
    await options.at(5).setSelected()
    await wrapper.setProps({ calculate: false })
    await input.setValue('4')
    vi.runAllTimers()
    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input?.at(-1)).toStrictEqual([4, '4'])
  })

  it('should check if the value is invalid', async () => {
    await wrapper.setProps({ calculate: true })
    await input.setValue('+e-')
    vi.runAllTimers()
    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input?.at(-1)).toStrictEqual(['0', ''])
  })

  it('should check if the value is zero', async () => {
    await input.setValue('0')
    vi.runAllTimers()
    await options.at(6).setSelected()
    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input?.at(-1)).toStrictEqual(['0', '0'])
  })

  it.each(units)('unit "$name" should exists in select options', ({ name }) => {
    const index = units.findIndex((unit) => unit.name === name)
    const unitName = name === '-' ? 'KSM' : name

    expect(options.length).toBe(14)
    expect(options.at(index).element.textContent).toBe(` ${unitName} `)
  })
})
