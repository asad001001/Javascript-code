# JavaScript Snippets

Front-end effects and helpers from client projects.

## [gsap-swipe-panels](gsap-swipe-panels)

A pinned section where each scroll/swipe slides one full-screen panel away, like a stack of cards — built with **GSAP 3 ScrollTrigger** (`ScrollTrigger.observe` + `matchMedia`). Also includes a lightweight `IntersectionObserver` reveal for `.scroll-animate` elements.

- Desktop only (≥ 769px); panels stack normally on mobile.
- Open `gsap-swipe-panels/index.html` in a browser to see the demo.

```html
<section class="swipe-panel">
  <div class="panel">One</div>
  <div class="panel">Two</div>
</section>
```
