/**
 * Scroll animations + GSAP swipe panels.
 *
 * 1. .scroll-animate elements get .scroll-animate-active when they enter the viewport.
 * 2. On desktop (>= 769px) the .swipe-panel section is pinned and each wheel/touch
 *    gesture slides one .panel to the left, like a stack of cards.
 *
 * Requires GSAP 3 + ScrollTrigger.
 */
'use strict';

function loadScrollObserver() {
  var elements = document.querySelectorAll('.scroll-animate');

  if (!('IntersectionObserver' in window)) {
    // Old browsers: show everything immediately.
    elements.forEach(function (el) { el.classList.add('scroll-animate-active'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-animate-active');
      }
    });
  }, { rootMargin: '-200px 0px -100px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
}

function initSwipePanels() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.matchMedia().add('(min-width: 769px)', function () {
    var panels = gsap.utils.toArray('.swipe-panel .panel');
    var currentIndex = 0;
    var allowScroll = true;
    var scrollTimeout = gsap.delayedCall(1, function () { allowScroll = true; }).pause();

    // First panel on top.
    gsap.set(panels, { zIndex: function (i) { return panels.length - i; } });

    function gotoPanel(index, isScrollingDown) {
      // Past the last / before the first panel: release the page scroll.
      if ((index === panels.length && isScrollingDown) || (index === -1 && !isScrollingDown)) {
        intentObserver.disable();
        return;
      }

      allowScroll = false;
      scrollTimeout.restart(true);

      var target = isScrollingDown ? panels[currentIndex] : panels[index];
      gsap.to(target, { xPercent: isScrollingDown ? -100 : 0, duration: 1.2 });
      currentIndex = index;
    }

    // Turns wheel/touch gestures into panel changes while the section is pinned.
    var intentObserver = ScrollTrigger.observe({
      type: 'wheel,touch',
      tolerance: 10,
      preventDefault: true,
      onUp: function () { if (allowScroll) gotoPanel(currentIndex - 1, false); },
      onDown: function () { if (allowScroll) gotoPanel(currentIndex + 1, true); },
      onEnable: function (self) {
        allowScroll = false;
        scrollTimeout.restart(true);
        var savedScroll = self.scrollY();
        self._restoreScroll = function () { self.scrollY(savedScroll); };
        document.addEventListener('scroll', self._restoreScroll, { passive: false });
      },
      onDisable: function (self) {
        document.removeEventListener('scroll', self._restoreScroll);
      }
    });
    intentObserver.disable();

    ScrollTrigger.create({
      trigger: '.swipe-panel',
      pin: true,
      start: 'top top',
      end: '+=200',
      onEnter: function (self) {
        if (intentObserver.isEnabled) return;
        self.scroll(self.start + 1);
        intentObserver.enable();
      },
      onEnterBack: function (self) {
        if (intentObserver.isEnabled) return;
        self.scroll(self.end - 1);
        intentObserver.enable();
      }
    });
  });
}

loadScrollObserver();
initSwipePanels();
