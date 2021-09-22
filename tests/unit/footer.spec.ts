import { mount } from '@vue/test-utils'
import Footer from '@/components/Footer.vue'

describe('Footer.vue', () => {
  test('Check if the footer exists', () => {
    const wrapper = mount(Footer, {
      stubs: ['router-link', 'b-icon']
    })
    const footer = wrapper.find('footer')

    expect(footer.exists()).toBe(true)
  })
})
