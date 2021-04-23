import { VueConstructor, PluginObject } from 'vue';
import VLazySrc, { VLazySrcOption } from './directive';

const VLazySrcPlugin: PluginObject<any> = {
  install(Vue: VueConstructor, options: VLazySrcOption = {}) {
    Vue.directive('lazy-src', VLazySrc(options))
  }
}

export default VLazySrcPlugin;
