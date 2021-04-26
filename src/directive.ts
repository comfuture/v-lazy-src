/* tslint:disable:import/no-unresolved */
import { VNode, DirectiveOptions /*, DirectiveBinding */ } from 'vue';

declare module globalThis {
  let _lazyImageObserver: IntersectionObserver;
}

export interface VLazySrcOption {
  threshold?: number;
  placeholder?: string;
}

interface TModifiers {
  raw?: boolean;
}

interface BindingOptions /* extends DirectiveBinding */ {
  name: string;
  value?: any;
  expression?: string;
  argument?: string;
  modifiers?: TModifiers;
}

const defaultOptions: VLazySrcOption = {
  threshold: 0.1,
  placeholder: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
}

const VLazySrc = (options: VLazySrcOption = {}): DirectiveOptions => {
  return {
    bind(el: HTMLElement, binding: BindingOptions, vnode: VNode): void {
      // check whether IntersectionObserver is supported or not
      const isSupported: boolean = 'IntersectionObserver' in globalThis

      // keep lazy-src for future
      const isDynamicValue: boolean | undefined = !binding.modifiers?.raw;
      const src = isDynamicValue ? binding.value : binding.expression;
      if (typeof src === 'undefined') {
        throw new TypeError('v-lazy-src directive must have a value')
      }
      el.dataset.lazySrc = src;
      
      if (!globalThis._lazyImageObserver) {
        if (isSupported) {
          // setup img element intersection callback
          const cb: IntersectionObserverCallback = (entries: IntersectionObserverEntry[],
                                                    observer: IntersectionObserver): void => {
            entries.forEach((entry: IntersectionObserverEntry) => {
              if (entry.isIntersecting) {
                const targetEl: HTMLElement = (entry.target as HTMLElement);
                const lazySrc: string = targetEl.dataset.lazySrc as string;
                targetEl.setAttribute('src', lazySrc);
              }
            })
          }
  
          const opserverOptions: IntersectionObserverInit = Object.assign({}, {
            threshold: options.threshold || defaultOptions.threshold as number
          })
  
          // make IntersectionObserver on window if not exists
          globalThis._lazyImageObserver = new IntersectionObserver(cb, opserverOptions);
        } else {
          // throw exception?
        }
      }

      if (isSupported) {
        el.setAttribute('src', options.placeholder || defaultOptions.placeholder as string);
      } else {
        el.setAttribute('src', src); // just set src attribute as lazySrc
      }
    },
    inserted(el: HTMLElement) {
      globalThis._lazyImageObserver?.observe(el);
    },
    unbind(el: HTMLElement) {
      globalThis._lazyImageObserver?.unobserve(el);
    }
  }
}

export default VLazySrc;
