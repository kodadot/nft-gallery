/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount, createLocalVue } from '@vue/test-utils'
import Buefy from 'buefy'
import { vi } from 'vitest'

import BalanceInput from '@/components/shared/BalanceInput.vue'

const localVue = createLocalVue()
localVue.use(Buefy)

test('BalanceInput.vue', async () => {
  vi.useFakeTimers()

  const wrapper = mount(BalanceInput, {
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
  const input = wrapper.find('[data-testid="balance-input"]')
  const options = wrapper
    .find('[data-testid="balance-input-select"]')
    .findAll('option')

  // test focus
  await (wrapper.vm as any).focusInput()
  expect(input.element).toBe(document.activeElement)

  // check html5validity
  await wrapper.setProps({ min: 10, max: 100 })
  await input.setValue('0')
  expect(await (wrapper.vm as any).checkValidity()).toBe(false)
  await input.setValue('50')
  expect(await (wrapper.vm as any).checkValidity()).toBe(true)
  await input.setValue('900')
  expect(await (wrapper.vm as any).checkValidity()).toBe(false)

  // set value from props
  await wrapper.setProps({ value: 3 })
  expect((input.element as HTMLInputElement).value).toBe('3')

  // check value
  await input.setValue('1')
  vi.runAllTimers()
  expect(wrapper.emitted().input).toBeTruthy()
  expect(wrapper.emitted().input?.at(-1)).toStrictEqual(['1000000000000', '1'])

  // change unit
  await options.at(6).setSelected()
  await input.setValue('2')
  expect(wrapper.find('option:checked').element.textContent).toBe(' Kilo ')
  vi.runAllTimers()
  expect(wrapper.emitted().input).toBeTruthy()
  expect(wrapper.emitted().input?.at(-1)).toStrictEqual([
    '2000000000000000000',
    '2',
  ])

  // if props calculate = false
  await options.at(5).setSelected()
  await wrapper.setProps({ calculate: false })
  await input.setValue('4')
  vi.runAllTimers()
  expect(wrapper.emitted().input).toBeTruthy()
  expect(wrapper.emitted().input?.at(-1)).toStrictEqual([4, '4'])

  // if value invalid
  await wrapper.setProps({ calculate: true })
  await input.setValue('+e-')
  vi.runAllTimers()
  expect(wrapper.emitted().input).toBeTruthy()
  expect(wrapper.emitted().input?.at(-1)).toStrictEqual(['0', ''])

  // if value zero
  await input.setValue('0')
  vi.runAllTimers()
  await options.at(6).setSelected()
  expect(wrapper.emitted().input).toBeTruthy()
  expect(wrapper.emitted().input?.at(-1)).toStrictEqual(['0', '0'])
})
