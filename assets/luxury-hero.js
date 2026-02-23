(function(){

  function initHero(section){

    if (!section) return;
    if (window.Shopify && Shopify.designMode) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    if (section.getAttribute('data-motion') !== 'true') return;

    const imgs = section.querySelectorAll('.lx-hero__img');
    if (!imgs.length) return;

    const zoomStrength = parseFloat(getComputedStyle(section).getPropertyValue('--lx-zoom')) || 0;
    const parallaxStrength = parseFloat(getComputedStyle(section).getPropertyValue('--lx-parallax')) || 0;

    let raf = null;

    const update = () => {
      raf = null;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));

      const scale = 1 + (zoomStrength / 500) * progress;
      const ty = (parallaxStrength * (0.5 - progress)) * 1.2;

      imgs.forEach(img => {
        img.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  document.addEventListener('DOMContentLoaded', function(){
    const section = document.getElementById({{ sid | json }});
    initHero(section);
  });

  // 🔥 This fixes Shopify Editor reload issue
  document.addEventListener('shopify:section:load', function(e){
    const section = e.target.querySelector('#{{ sid }}');
    initHero(section);
  });

})();