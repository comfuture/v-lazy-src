import { shallowMount, createLocalVue } from '@vue/test-utils'
import 'intersection-observer'
import VLazySrcPlugin from '..'

// <img v-lazy-src="img" />
// <img v-lazy-src.raw="https://placekitten.com/408/287" />

describe('v-lazy-src directive', () => {
  const localVue = createLocalVue()
  localVue.use(VLazySrcPlugin)

  it('make an intersection observer to window', () => {
    // <img v-lazy-src="img" />
    const Img = {
      props: {
        img: String
      },
      template: '<img v-lazy-src="img" >'
    }

    const wrapper = shallowMount(Img, {
      localVue,
      attachedToDocument: true,
      propsData: {
        img: 'https://placekitten.com/408/287'
      }
    })
    expect(globalThis._lazyImageObserver instanceof IntersectionObserver).toBeTruthy()
  })
  
  // XXX: IntersectionObserver polyfill does not fires callback
  test.skip('should be used as an attribute of html element', done => {
    // <img v-lazy-src="img" />
    const Img = {
      props: {
        img: String
      },
      template: '<img v-lazy-src="img" >'
    }

    const wrapper = shallowMount(Img, {
      localVue,
      attachedToDocument: true,
      propsData: {
        img: 'https://placekitten.com/408/287'
      }
    })
    expect(wrapper.attributes('src')).toBe('https://placekitten.com/408/287')
  })

  // XXX: can not be implemented because of vue 2 directive always try to parse v-* binded props as expression and throws parse error
  test.skip('should be able to use `.raw` modifier', () => {
    // <img v-lazy-src.raw="img" />
    const Img = {
      template: '<img v-lazy-src.raw="https://placekitten.com/408/287" >'
    }
    const wrapper = shallowMount(Img, {
      localVue,
      attachedToDocument: true
    })
    expect(wrapper.attributes('src')).toBe('https://placekitten.com/408/287')
  })

  // XXX: IntersectionObserver polyfill does not fires callback
  test.skip('should render empty image unless intersects with viewport', async () => {
    const Wrapper = {
      props: {
        img: String
      },
      template: `<div>
        ${Array(100).fill('<br/>').join('\n')}
        <img v-lazy-src="img" >
      </div>`
    }
    const wrapper = shallowMount(Wrapper, {
      localVue,
      attachedToDocument: true,
      propsData: {
        img: 'https://placekitten.com/408/287'
      }
    })
    const img = wrapper.find('img')
    expect(img.attributes('data-lazy-src')).toBe('https://placekitten.com/408/287')
    expect(img.attributes('src')).not.toBe('https://placekitten.com/408/287')
    globalThis.dispatchEvent(new CustomEvent('scroll', {detail: 1e4}))  // after scroll down to the end
    expect(img.attributes('src')).toBe('https://placekitten.com/408/287')
  })
})
