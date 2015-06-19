## Deprecated since Flickity v1.1 has been released with [lazyLoad option added](http://flickity.metafizzy.co/options.html#lazyload).




# Flickity lazyload

Enables the `lazyLoad` option for [Flickity](http://flickity.metafizzy.co)

```html
<img data-lazy="http://i.imgur.com/r8p3Xgq.jpg"/>
```

``` js
var flkty = new Flickity( '.main-gallery', {
  // load images ondemand or progressive
  lazyLoad: 'ondemand' // or lazyLoad: 'progressive'
})
```

## Install

Bower: `bower install flickity-lazyload`

npm: `npm install flickity-lazyload`

---

By [Guillaume Lafarge](http://prys.me)
