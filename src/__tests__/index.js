import { mount, createLocalVue } from '@vue/test-utils'
import VLazySrcPlugin from '..'

// <img v-lazy-src="img" />
// <img v-lazy-src.raw="https://placekitten.com/408/287" />

describe('v-lazy-src directive', () => {
  const vue = createLocalVue()
  vue.use(VLazySrcPlugin)

  const Img = {
    template: '<img />'
  }

  it('should be a property of html element', () => {
    const lazySrc = jest.fn()
    // <img v-lazy-src="img" />
    const wrapper = mount(Img, {
      directives: {
        lazySrc
      }
    })
    expect(lazySrc).toHaveBeenCalled()
  })

  it('creates an intersectionOpserver to global', () => {
    const lazySrc = jest.fn()
    const wrapper = mount(Img, {
      directives: {
        lazySrc
      }
    })
    expect(globalThis._lazyImageOpserver instanceof IntersectionObserver).toBeTruthy()
  })
})
