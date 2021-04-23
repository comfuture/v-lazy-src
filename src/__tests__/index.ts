import { mount, createLocalVue } from '@vue/test-utils'
import VLazySrcPlugin from '..'

describe('v-lazy-src directive', () => {
  const vue = createLocalVue()
  vue.use(VLazySrcPlugin)

  const Img = {
    template: '<img />'
  }

  it('should be a property of html element', () => {
    const lazySrc = jest.fn()
    const wrapper = mount(Img, {
      directives: {
        lazySrc
      }
    })
    expect(lazySrc).toHaveBeenCalled()
  })
})
