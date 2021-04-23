# v-lazy-src

A custom directive that make `<img>` tag to have their own lazy loading feature.

## Usage

```html
<img v-lazy-src="entry.image">
```

When the img tag intersects within viewport (default threshold: 0.1), it starts load the value of directive as img's src.

If the src is static url not dynamic value, use `.raw` modifier.

```html
<img v-lazy-src.raw="https://placekitten.com/408/287" />
```

## Installation

```js
import Vue from 'vue'
import VLazySrcPlugin from 'v-lazy-src'

Vue.use(VLazySrcPlugin)
```

the plugin accepts two options:

- threshold: which amount of element intersects within root element (default: 0.1)
- placeholder: url of placeholder image src that shown before img tag should be shown (default: **empty transparent gif**)

```js
Vue.use(VLazySrcPlugin, {threshold: 0.5, placeholder: '/path/to/empty.png'})
```

will show `/path/to/empty.png` until half of img element's rect is intersects with viewport, then loads `lazySrc`

Or just make local directive in your component:

```js
import { VLazySrc } from 'v-lazy-src'

{
  name: 'YourComponent',
  directives: {
    lazySrc: VLazySrc({threshould: 0})
  }
  ...
}
```