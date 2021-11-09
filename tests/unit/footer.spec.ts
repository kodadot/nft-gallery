import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Footer from '@/components/Footer.vue'

describe('Footer.vue', () => {
  it('Check if the footer exists', () => {
    const wrapper = mount(Footer, {
      stubs: ['router-link', 'b-icon']
    })
    const footer = wrapper.find('footer')

    expect(footer.exists()).to.be.equal(true)
  })
})
