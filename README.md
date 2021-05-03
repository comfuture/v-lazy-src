# v-lazy-src

A custom directive that make `<img>` tag to have their own lazy loading feature.
It uses only one `IntersectionObserver` to observe all lazy images (even $route changes).

## Usage

```html
<img v-lazy-src="entry.image">
```

When the img tag intersects within viewport (default threshold: 0.1), it starts load the value of directive as img's src.

For static url, you should use additional quotes within value, or use `data-lazy-src` property.

```html
<img v-lazy-src="'https://placekitten.com/408/287'" />
<!-- or -->
<img v-lazy-src data-lazy-src="https://placekitten.com/408/287" />
```

## Installation

```js
import Vue from 'vue'
import VLazySrcPlugin from 'v-lazy-src'

Vue.use(VLazySrcPlugin)
```

the plugin accepts two options:

- threshold: which amount of element intersects within root element (default: `0.1`)
- placeholder: url of placeholder image src that loaded before img tag should be shown (default: **empty transparent gif**)

```js
Vue.use(VLazySrcPlugin, {threshold: 0.5, placeholder: '/path/to/empty.png'})
```

will show `/path/to/empty.png` unless half of img element's rect is intersects with viewport, then loads lazy src.

Or just setup directive for each component:

```js
import { VLazySrc } from 'v-lazy-src'

export default {
  name: 'YourComponent',
  directives: {
    lazySrc: VLazySrc({threshould: 0})
  },
  template: `<div>
    <img v-lazy-src="..." />
  </div>`
  ...
}
```