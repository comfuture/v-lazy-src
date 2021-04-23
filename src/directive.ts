import { VNode, DirectiveOptions /*, DirectiveBinding */ } from 'vue';

declare module globalThis {
  let _lazyImageOpserver: IntersectionObserver;
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
  
      // keep lazy-src for future
      const isDynamicValue: boolean | undefined = !binding.modifiers?.raw;
      const src = isDynamicValue ? binding.value : binding.expression;
      if (typeof src === 'undefined') {
        throw new TypeError('v-lazy-src directive must have a value')
      }
      el.dataset.lazySrc = src;
      
      if (!globalThis._lazyImageOpserver) {
        if ('IntersectionObserver' in globalThis) {
  
          // setup img element intersection callback
          const cb: IntersectionObserverCallback = (entries: IntersectionObserverEntry[],
                                                    observer: IntersectionObserver): void => {
            entries.forEach((entry: IntersectionObserverEntry) => {
              // do something
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
          globalThis._lazyImageOpserver = new IntersectionObserver(cb, opserverOptions);
        } else {
          // throw exception?
          el.setAttribute('src', src); // just set src attribute as lazySrc
        }
      } else {
        el.setAttribute('src', options.placeholder || defaultOptions.placeholder as string);
      }
    },
    inserted(el: HTMLElement) {
      globalThis._lazyImageOpserver?.observe(el);
    },
    unbind(el: HTMLElement) {
      globalThis._lazyImageOpserver?.unobserve(el);
    }
  }
}

export default VLazySrc;
